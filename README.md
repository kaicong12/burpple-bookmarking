# Restaurant Bookmarking App

## Overview

Welcome to the Restaurant Bookmarking App! This application allows users to easily bookmark and manage their favorite restaurants. Whether you're a foodie looking to remember the best spots in town or someone who just wants to keep track of new places to try, this app is designed to help you do just that.

## Functional Requirements

### User Authentication
- **Social Media Login**: Users should have the option to log in using their social media accounts (e.g., Twitter, Google).
- **Logout**: Users should be able to logout securely

### Restaurant Bookmarking
- **Add Bookmark**: Users should be able to bookmark a restaurant by entering details such as name, address.
- **Edit Bookmark**: Users should be able to edit the details of a bookmarked restaurant.
- **Cancel Edit Confirmation**: Users should be notified if they want to discard his edit changes
- **Delete Bookmark**: Users should be able to remove a restaurant from their bookmarks. Delete a bookmarked restaurant should remove it from the folders where this restaurant is in.
- **View Bookmarks**: Users should be able to view a list of all their bookmarked restaurants.

### Folder
- **Create Folder**: Users should be able to create a new folder and name it
- **Add Restaurants To Folder**: Users should be able to organize their bookmarks into folders, one restaurant can be in multiple folders and one folder can contain multiple restaurants
- **Edit Folder**: Users should be able to rename folders. 
- **Cancel Edit Confirmation**: Users should be notified if they want to discard his edit changes
- **Deleting Folder**: Users should be able to delete folders. Deleting a folder should not delete the bookmarks within it.

### Error Handling
- **Error while logging in**: Users should be notified the reason as to why they are unable to sign in
- **Error while adding restaurant**: Users should be notified why they are unable to save their bookmark restaurant

### Search and Filter
- **Search Restaurants**: Users should be able to search for restaurants by name, description, or cuisine type.
- **Filter Restaurants**: Users should be able to filter their bookmarked restaurants by location.
- **Restaurant Empty State**: Users should be shown an empty state when no restaurants match the search criteria and be informed on how to fix their search query
- **Folder Empty State**: Users should be clearly notified when there is no restaurant under a folder


## Non-Functional Requirements

### Performance
- **Fast Loading Times**: The application should load quickly, with a target load time of under 3 seconds for the main user interface.

### Scalability
- **Handle User Growth**: The backend should be able to scale to accommodate a growing number of users and increasing amounts of data.
- **Serverless Architecture**: Utilizing Firebase's serverless capabilities to automatically handle scaling without manual intervention.

### Security
- **Secure Authentication**: Use OAuth for secure social media logins and ensure secure token handling.
- **Access Control**: Implement proper access control to ensure that users can only access their own data.