# Guardian Wings

## Overview

Guardian Wings is a project designed to enhance personal safety and security through innovative technology solutions. This repository contains the codebase for the Guardian Wings app, which integrates various safety features to provide users with a reliable and effective personal security system.

## Introduction

With the increase in usage of digital devices by younger children and lesser supervision by parents, children are spending excessive time gaming or watching shows. Guardian Wings aims to address these issues by providing a platform where children can easily share updates with their parents about their daily tasks. Parents can reward their children with screen time, granting access to streaming apps and games, as a form of positive reinforcement.

## Features

- **Automated Notifications**: Receive automated notifications in case of potential threats or emergencies.
- **User-Friendly Interface**: Easy-to-use interface designed for quick access to essential features.
- **Secure Data Handling**: Ensures user data privacy and security through encrypted communication and data storage.
- **App Blocker**: Restrict access to certain entertainment apps and games, set by the parent.
- **Daily To-Do List**: A daily to-do list for the child, set by the parents.
- **Screen Time Authentication**: User authentication by the parent to give screen time.
- **Punishment System**: Implement a punishment system for incomplete tasks.
- **Interest Rate System**: Manage an interest rate system for saved-up screen time.

## Proposal

Guardian Wings is designed to create a platform where children can easily share updates with their parents about their daily tasks. Parents can reward them with screen time, granting access to streaming apps and games, as a form of positive reinforcement.

## Installation

To get started with Guardian Wings, follow these steps:

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/SahejAgarwal05/gaurdianWings.git
    ```
2. **Navigate to the Project Directory**:
    ```bash
    cd gaurdianWings
    ```
3. **Install Dependencies**:
    ```bash
    npm install
    ```
4. **Run the Application**:
    ```bash
    npm start
    ```

### Code Files

#### `src/components/`

- **Header.js**: Contains the header component of the app, including navigation links.
- **Footer.js**: Contains the footer component with additional information and links.
- **EmergencyButton.js**: The button component that users press to send emergency alerts.
- **MapView.js**: Displays the real-time location tracking map.

#### `src/screens/`

- **HomeScreen.js**: The main dashboard screen of the app.
- **LoginScreen.js**: Screen for user login.
- **SignUpScreen.js**: Screen for user registration.
- **ProfileScreen.js**: Screen where users can view and edit their profile information.
- **SettingsScreen.js**: Screen for app settings and preferences.

#### `src/services/`

- **AuthService.js**: Handles authentication-related tasks, such as login and registration.
- **LocationService.js**: Manages location tracking functionalities.
- **NotificationService.js**: Handles sending and receiving notifications.

#### `src/utils/`

- **constants.js**: Stores constant values used across the app.
- **helpers.js**: Contains helper functions to be used throughout the codebase.
- **validators.js**: Functions for validating user input.

#### `src/`

- **App.js**: The main component that initializes the app and sets up the routes.
- **index.js**: Entry point of the application.

#### `public/`

- **index.html**: The main HTML file for the app.
- **manifest.json**: Provides metadata for the app.

## Tech Stack

- **Frontend**: React Native, hosted on EXPO.
- **Backend**: Firebase for managing backend processes.

## Extensions

- **Browser Extension**: A browser extension to be used on laptops or PCs.
- **Educational Resources**: Access to educational resources that can give the child more screen time upon completion.
- **Reports and Insights**: Generate reports and insights based on children's activities, helping parents understand their child's digital habits and make informed decisions.

## Usage

1. **Sign Up / Log In**: Create a new account or log in with your existing credentials.
2. **Set Up Emergency Contacts**: Add and manage your emergency contacts who will receive alerts.
3. **Enable Location Services**: Allow the app to access your location for real-time tracking.
4. **Activate Safety Features**: Use the app's safety features as needed for personal security.

## Contributing

We welcome contributions to improve Guardian Wings. To contribute:

1. **Fork the Repository**: 
    ```bash
    git fork https://github.com/SahejAgarwal05/gaurdianWings.git
    ```
2. **Create a New Branch**:
    ```bash
    git checkout -b feature/your-feature-name
    ```
3. **Commit Your Changes**:
    ```bash
    git commit -m "Add your message here"
    ```
4. **Push to the Branch**:
    ```bash
    git push origin feature/your-feature-name
    ```
5. **Create a Pull Request**: Submit a pull request detailing your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact

For any questions or feedback, please contact:

- **Sahej Agarwal** - sahej.agarwal@example.com

## Acknowledgments

Special thanks to all contributors and supporters of the Guardian Wings project.

---

Thank you for using Guardian Wings! Your safety is our priority.
