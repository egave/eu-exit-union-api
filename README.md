# Deno Deploy Backend with Socket.IO

This project is a backend server built using Deno Deploy to handle real-time communication using Socket.IO. It includes functionality to update and retrieve data (votes and inscrits) while also supporting real-time updates to connected clients.

## Features

- RESTful API endpoints for updating votes and inscrits.
- Real-time updates using Socket.IO to push data changes to connected clients.
- CORS support for handling cross-origin requests.
- Integration with Deno Deploy KV for storing and retrieving data.


## Getting Started

1. Clone this repository to your local machine.
2. Install the required dependencies by running `deno install --unstable --allow-read --allow-net --allow-env --name=<INSTALL_NAME> https://deno.land/x/deploy/deployctl.ts`.
3. Set up your Deno Deploy account and create a new project.
4. Configure environment variables in your Deno Deploy project, including `POST_SECRET_KEY` and any other necessary variables.
5. Deploy the application using Deno Deploy.
6. Access the deployed backend and start interacting with the RESTful endpoints or connect a client to the WebSocket server for real-time updates.

## Usage

### RESTful API Endpoints

- `POST /update-votes/:id`: Update votes data. Requires a valid `POST_SECRET_KEY` as part of the request parameters (`id`). Body should contain the updated votes data.
- `POST /update-inscrits/:id`: Update inscrits data. Requires a valid `POST_SECRET_KEY` as part of the request parameters (`id`). Body should contain the updated inscrits data.


### Environment variables:

    PORT: Port number for the server to listen on.
    
    POST_SECRET_KEY: Secret key for authorizing POST requests to update data.

### Real-time Updates with Socket.IO

- Connect to the WebSocket server using Socket.IO to receive real-time updates for votes and inscrits data. Listen for events `votes` and `inscrits` to receive updated data.

## Additional Notes

- Customize the CORS configuration in `server.ts` to allow specific origins, methods, headers, etc., as per your requirements.
- Adjust the maximum version stamp history (`MAX_VERSIONSTAMP_HISTORY`) as needed to manage the history of version stamps for data updates.

## Contributors

- [Your Name or Username] - [Link to your profile or website]

## License

This project is licensed under the [MIT License](LICENSE).