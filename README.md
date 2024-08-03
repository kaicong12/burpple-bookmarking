# Restaurant Bookmarking App

## Overview

Welcome to the Restaurant Bookmarking App! This application allows users to easily bookmark and manage their favorite restaurants. Whether you're a foodie looking to remember the best spots in town or someone who just wants to keep track of new places to try, this app is designed to help you do just that.

## Functional Requirements

### User Authentication
- **Social Media Login**: Users should have the option to log in using their social media accounts (e.g., Twitter, Google).
- **Logout**: Users should be able to logout securely

### Restaurant Bookmarking
- **Add Bookmark**: Users should be able to bookmark a restaurant by entering details such as name, address, and cuisine.
- **Edit Bookmark**: Users should be able to edit the details of a bookmarked restaurant.
- **Delete Bookmark**: Users should be able to remove a restaurant from their bookmarks.
- **View Bookmarks**: Users should be able to view a list of all their bookmarked restaurants.

### Folder
- **Create Folder**: Users should be able to create a new folder and name it
- **Add Restaurants To Folder**: Users should be able to organize their bookmarks into folders
- **Edit Folder**: Users should be able to rename folders. 
- **Deleting Folder**: Users should be able to delete folders. The app should ensure that deleting a folder does not delete the bookmarks within it.

### Error Handling
- **Error while logging in**: Users should be notified the reason as to why they are unable to sign in
- **Error while adding bookmark**: Users should be notified why they are unable to save their bookmark

### Search and Filter
- **Search Restaurants**: Users should be able to search for restaurants by name, description, or cuisine type.
- **Filter Restaurants**: Users should be able to filter their bookmarked restaurants by different criteria such as cuisine type or location.
- **Empty State**: Users should be shown an empty state when no restaurants match the search criteria and be informed on how to fix their search query


## Non-Functional Requirements

### Performance
- **Fast Loading Times**: The application should load quickly, with a target load time of under 3 seconds for the main user interface.

### Scalability
- **Handle User Growth**: The backend should be able to scale to accommodate a growing number of users and increasing amounts of data.
- **Serverless Architecture**: Utilizing Firebase's serverless capabilities to automatically handle scaling without manual intervention.

### Security
- **Secure Authentication**: Use OAuth for secure social media logins and ensure secure token handling.
- **Access Control**: Implement proper access control to ensure that users can only access their own data.