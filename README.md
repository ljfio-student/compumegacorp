# CompuMegaCorp

**Author:** Luke Fisher

**Matriculation:** 1309106

The ultimate work simulator. Your mission as poor soul number 10001 in CompuMegaCorp's employee database, is to work work work.
Your role is to join task forces to ensure the completion of jobs are done so promptly!
However, there is a chance that one of the job's tasks fail to complete, leaving a member of the team having to take the blame.

The choice is yours, on whether to take the blame yourself or to point the finger at one of your peers.
Based on how well you corroborate your stories, the CEO will take note of the incompetent and demote them down the career ladder.
If you're able to blag your way out of the task failing, the CEO will promote your efforts in keeping the team afloat.

## Functionality

Outlined below is a list of the functionality that has been implemented.

### Implemented

- Login
- Logout
- Register
- View Dashboard
- View List of Jobs
- View Job
- Join a Task Force
- Blame a Team Member
- Realtime Chat

## Future Additions

Look to add variable weighting to the score system when score is to be deducted.
Making it more dangerous to get the blame higher up the management ladder.

It would have been good to edit the list of available tasks within the system from an admin user interface.
Potentially disabling user accounts from an admin interface as well.

Users to have the ability to change their username, email or password.

## Setup

The application is split into two components: server and client. Each located within their own directory.

### Server

The server was developed using NodeJS, Express and MongoDB defining HTTP API methods for the client side to communicate with.
Socket.IO was used to implement real-time chat room.

This requires the use of TypeScript to compile the server.
All dependencies can be installed by running the following command in the server directory.

```bash
npm install
```

The server can be built using the following command, this runs the TypeScript compiler.

```bash
npm run build
```

To then run the server, use the following command:

```bash
npm run start
```

### Client

The client applicaiton was built using VueJS, and simply setup using the yarn webpack template.
This front-end technology allows rapid development through live reloading and simple structured view management.

For communication with the server Axios was used to make HTTP AJAX requests with HTTP `Authorization: Bearer` header.
Socket.IO was used to implement real-time chat room.

To install the decendencies required to run the client side, run the following command:

```bash
npm install
```

To run the development web server which hosts a web page accessible by a web browser, run the following command:

```bash
npm run serve
```