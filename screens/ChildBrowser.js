import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, TextInput } from 'react-native';
import { WebView } from 'react-native-webview';
import { ref, push, set, onValue } from 'firebase/database';
import { db } from './firebaseConfig';
import { Ionicons } from '@expo/vector-icons'; 
import validator from 'validator';

const Browser = ({ username, navigation }) => {
  const [tabs, setTabs] = useState([]);
  const [currentTab, setCurrentTab] = useState(null);
  const [history, setHistory] = useState([]);
  const [newTabUrl, setNewTabUrl] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const webViewRefs = useRef({});
  const textInputRef = useRef(null);
  const blockedSites = ['facebook.com', 'instagram.com'];
  const handleTabChange = (tabId) => {
    const selectedTab = tabs.find(tab => tab.id === tabId);
    if (selectedTab) {
      setCurrentTab(tabId);
      setCurrentUrl(selectedTab.url); 
    }
  };

  const handleAddTab = () => {
    const url = 'https://www.google.com';
    const newTabId = (tabs.length + 1).toString();
    const newTab = { id: newTabId, title: `Tab ${newTabId}`, url };
    setTabs([...tabs, newTab]);
    setCurrentTab(newTabId);
    setCurrentUrl(url);
  };
  const handleCloseTab = (tabId) => {
    const updatedTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(updatedTabs);
    if (currentTab === tabId) {
      setCurrentTab(updatedTabs.length > 0 ? updatedTabs[0].id : null);
      setCurrentUrl(updatedTabs.length > 0 ? updatedTabs[0].url : '');
    }
  };
  const handleHistoryClick = (url) => {
    const updatedTabs = tabs.map(tab =>
      tab.id === currentTab ? { ...tab, url } : tab
    );
    setTabs(updatedTabs);
    setCurrentTab(currentTab);
    setCurrentUrl(url);
    if (webViewRefs.current[currentTab]) {
      webViewRefs.current[currentTab].reload();
    }
    setIsHistoryVisible(false); 
  };

  const logHistory = async (url) => {
    try {
      const historyRef = ref(db, `child/${username}/browsingHistory`);
      const newHistoryRef = push(historyRef);
      await set(newHistoryRef, {
        url,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error logging history:', error.message);
    }
  };

  const handleNavigationStateChange = async (navState) => {
    const url = navState.url;
    setCurrentUrl(url); // Update the current URL state here
    if (!blockedSites.some(site => url.includes(site))) {
      await logHistory(url);
    }
  };

const handleGoButton = () => {
  const isValidUrl = (url) => validator.isURL(url, {
    protocols: ['http', 'https'],
    require_protocol: true,
    require_valid_protocol: true
  });

  const url = isValidUrl(currentUrl) ? currentUrl : `https://www.google.com/search?q=${encodeURIComponent(currentUrl)}`;

  const updatedTabs = tabs.map(tab =>
    tab.id === currentTab ? { ...tab, url } : tab
  );
  setTabs(updatedTabs);
  setCurrentUrl(url);
  if (webViewRefs.current[currentTab]) {
    webViewRefs.current[currentTab].reload();
  }
};

  const toggleHistory = () => {
    setIsHistoryVisible(!isHistoryVisible);
  };

  const handleFocus = () => {
    textInputRef.current.setNativeProps({ selection: { start: 0, end: currentUrl.length } });
  };

  useEffect(() => {
    const historyRef = ref(db, `child/${username}/browsingHistory`);
    const unsubscribe = onValue(historyRef, (snapshot) => {
      if (snapshot.exists()) {
        const historyData = snapshot.val();
        const historyList = Object.keys(historyData).map(key => ({
          id: key,
          ...historyData[key],
        }));
        setHistory(historyList);
      }
    });

    return () => unsubscribe();
  }, [username]);

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <FlatList
          data={tabs}
          keyExtractor={item => item.id}
          horizontal
          renderItem={({ item }) => (
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  item.id === currentTab && styles.activeTab
                ]}
                onPress={() => handleTabChange(item.id)}
              >
                <Text style={styles.tabText}>{item.title}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => handleCloseTab(item.id)}
              >
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
            </View>
          )}
        />
        <TouchableOpacity onPress={handleAddTab} style={styles.addButton}>
          <Ionicons name="add" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleHistory} style={styles.historyButton}>
          <Ionicons name="time" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.urlBar}>
        <TextInput
          ref={textInputRef}
          style={styles.urlInput}
          value={currentUrl}
          onChangeText={setCurrentUrl}
          placeholder="Enter URL or search query"
          onFocus={handleFocus}
        />
        <TouchableOpacity onPress={handleGoButton} style={styles.goButton}>
          <Text style={styles.goButtonText}>Go</Text>
        </TouchableOpacity>
      </View>
      {isHistoryVisible && (
        <FlatList
          data={history}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleHistoryClick(item.url)}>
              <View style={styles.historyItem}>
                <Text>{item.url}</Text>
                <Text>{item.timestamp}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
      {tabs.map(tab => (
        <View key={tab.id} style={currentTab === tab.id ? styles.webviewContainer : styles.hidden}>
          <WebView
            source={{ uri: tab.url }}
            ref={ref => (webViewRefs.current[tab.id] = ref)}
            onNavigationStateChange={handleNavigationStateChange}
            onShouldStartLoadWithRequest={(request) => {
              const isBlocked = blockedSites.some(site => request.url.includes(site));
              if (isBlocked) {
                Alert.alert('Blocked', 'This site is blocked.');
                return false;
              }
              return true;
            }}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#f1f1f1',
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabButton: {
    padding: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: 'blue',
  },
  tabText: {
    fontSize: 16,
  },
  closeButton: {
    padding: 5,
    marginLeft: 5,
  },
  closeButtonText: {
    color: 'red',
    fontWeight: 'bold',
  },
  addButton: {
    padding: 10,
    marginLeft: 10,
  },
  historyButton: {
    padding: 10,
    marginLeft: 10,
  },
  urlBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f1f1f1',
  },
  urlInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    marginHorizontal: 10,
  },
  goButton: {
    padding: 10,
    backgroundColor: '#007AFF'
  },
  goButtonText: {
    color: 'white',
  },
  webviewContainer: {
    flex: 1,
  },
  hidden: {
    display: 'none',
  },
  historyItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default Browser;