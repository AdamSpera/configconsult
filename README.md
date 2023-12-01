# ConfigConsult.com

ConfigConsult.com is a Flask-based web application that makes it easy to debug and view Cisco IOS config files.

Best part is that its entirely client side! So your config stays only with you and your device.

## Setup

There are two ways to run ConfigConsult.com:

### Running Locally

1. Ensure you have Python and Flask installed on your machine. If Flask is not installed, you can install it using pip:

    ```bash
    pip install flask
    ```

2. Clone the repository:

    ```bash
    git clone https://github.com/adamspera/configconsult.git
    ```

3. Navigate to the cloned repository:

    ```bash
    cd configconsult
    ```

4. Run the Flask application:

    ```bash
    python app.py
    ```

5. Open your web browser and navigate to `http://localhost:5000`.

### Running on a VM

1. Follow steps 1-3 from the "Running Locally" section.

2. Update the Flask app to run on your VM's public IP address. Modify the last line of `app.py` to:

    ```python
    app.run(host='0.0.0.0', debug=True)
    ```

3. Run the Flask application:

    ```bash
    python app.py
    ```

4. Open your web browser and navigate to `http://<your-vm-ip>:5000`.

Please replace `<your-vm-ip>` with your VM's public IP address.

## Contributing

We welcome contributions! Please reach out to Adam Spera on LinkedIn for more details!

## License

This project is licensed under the terms of the MIT license. See the [LICENSE](LICENSE) file for details.