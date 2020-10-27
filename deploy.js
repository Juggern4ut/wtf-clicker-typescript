const fs = require("fs");
const FtpClient = require("ftp");
const glob = require("glob");

// The path in the repository that
// should be pushed to the FTP
const basePath = "./webpage/dist";

// The path on the ftp-server where the
// files should be pushed to
const destinationPath = "/public_html/clicker2.lmeier.ch";

// The configuration used to connect
// to your FTP server
const config = {
  host: "myhost.com",
  password: "mySecretPa$$word",
  user: "homer",

  //Connect to FTP using TSL
  secure: true,
  secureOptions: {
    //If you have a selfsigned certificate
    //you need to set this to false
    rejectUnauthorized: false
  }
};

const ftpClient = new FtpClient();

function createDirectory(destination) {
  return ftpClient.mkdir(destination, true, error => {
    if (error) throw error;

    ftpClient.end();
  });
}

function uploadFile(file, destination) {
  ftpClient.put(file, destination, error => {
    if (error) throw error;

    console.log(`${file} => ${destination}`);
    ftpClient.end();
  });
}

// Check if the path is a directory and
// either create the directory on the server
// if it is a directory, or upload the file
// if it is a file.
function handlePath(path) {
  const relativeFile = path.replace(`${basePath}/`, "");
  const destination = `${destinationPath}/${relativeFile}`;

  if (fs.lstatSync(path).isDirectory()) {
    return createDirectory(destination);
  }

  return uploadFile(path, destination);
}

ftpClient.on("ready", () => {
  // Get an array of all files and directories
  // in the given base path and send them to the
  // `handlePath()` function to decide if a
  // directory is created on the server or the
  // file is uploaded.
  glob.sync(`${basePath}/**/*`).forEach(handlePath);
});

ftpClient.connect(config);
