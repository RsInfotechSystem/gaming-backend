// Used to render the change password form
const changePasswordForm = async (request, response) => {
    try {
        const token = request.query.token;

        if (!token) {
            return response.status(200).json({
                status: "FAILED",
                message: "Token is missing"
            });
        }

        response.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Reset Password</title>
            </head>
            <body>
                <h1>Reset Password</h1>
                <form action="/player/reset-player-password" method="POST">
                    <input type="hidden" name="token" value="${token}" />
                    <label for="newPassword">New Password:</label>
                    <input type="password" id="newPassword" name="newPassword" required><br>
                    <label for="confirmNewPassword">Confirm New Password:</label>
                    <input type="password" id="confirmNewPassword" name="confirmNewPassword" required><br>
                    <button type="submit">Submit</button>
                </form>
            </body>
            </html>
        `);
    } catch (error) {
        return response.status(500).json({
            status: "FAILED",
            message: error.message
        });
    }
}

module.exports = changePasswordForm;