# Database Setup Guide 🗄️

Synthezy uses **MongoDB** to save your whiteboards and allow collaboration persistence.

## Current Status
I have **already configured the code** for you.
- The app now attempts to connect to MongoDB on startup.
- If no database is found, it **automatically switches to Offline Mode** (data is temporary).
- Once you install MongoDB, it will automatically connect and start saving data!

## Option 1: Install MongoDB Locally (Recommended)

1.  **Download MongoDB Community Server**:
    - Go to: https://www.mongodb.com/try/download/community
    - Download the MSI installer for Windows.

2.  **Install**:
    - Run the installer.
    - Choose "Complete" setup.
    - **Important**: Check "Install MongoDB as a Service".

3.  **Run**:
    - MongoDB usually runs automatically as a Windows Service.
    - To verify, open PowerShell and type: `mongod --version` (you might need to add it to your PATH) or simply check Task Manager for "MongoDB Database Server".

4.  **Restart Synthezy**:
    - Restart your backend terminal (`npm run server`).
    - It should now say: `✅ MongoDB Connected`

## Option 2: Use MongoDB Atlas (Cloud)

If you prefer not to install anything:

1.  Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Create a free cluster.
3.  Get your **Connection String**. It looks like:
    `mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/synthezy?retryWrites=true&w=majority`
4.  Open `server/.env` file.
5.  Replace `mongodb://localhost:27017/synthezy` with your Cloud Connection String.
6.  Restart the server.
