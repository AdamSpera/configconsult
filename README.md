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

## File Structure and Cloudflare Pages Hosting

Our application has a slightly unusual file structure due to the way we host it on Cloudflare Pages. Here's a brief explanation:

- `root/index.html`: This is the entry point of our application when hosted on Cloudflare Pages. It uses AJAX to fetch the content of `root/templates/index.html` and replace its own content with it. This allows us to host the application on Cloudflare Pages in the same repository without changing the file structure.

- `root/templates/index.html`: This is the main HTML file of our application. It's fetched by `root/index.html` using AJAX when the application is hosted on Cloudflare Pages.

Please note that when running the application locally or on a VM, Flask serves `root/templates/index.html` directly, and `root/index.html` is not used.

Next steps:
1. Run the application locally or on a VM following the instructions in the Setup section.
2. Test the application on Cloudflare Pages by navigating to your Cloudflare Pages URL.

## Contributing

We welcome contributions! Please reach out to Adam Spera on LinkedIn for more details!

## License

This project is licensed under the terms of the MIT license. See the [LICENSE](LICENSE) file for details.