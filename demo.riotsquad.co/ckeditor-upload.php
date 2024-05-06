<?php

$targetDir = "uploads/"; 
$uploadedFileName = basename($_FILES["upload"]["name"]);
$targetFilePath = $targetDir . $uploadedFileName;
$fileType = pathinfo($targetFilePath, PATHINFO_EXTENSION);


$allowedTypes = array("jpg", "jpeg", "png", "gif");
    
/* For deleting all existing images*/
$directory = $targetDir;
if (is_dir($directory)) {
    if ($dh = opendir($directory)) {
        while (($file = readdir($dh)) !== false) {
            if ($file != '.' && $file != '..') {
                if (is_file($directory . $file)) {
                    unlink($directory . $file);
                }
            }
        }
        closedir($dh);
    }
}
/* For deleting all existing images*/


if (in_array($fileType, $allowedTypes)) {
    if (move_uploaded_file($_FILES["upload"]["tmp_name"], $targetFilePath)) {
        
        echo json_encode(array("url" => $targetFilePath));
    } else {
        echo json_encode(array("error" => "There was an error uploading your file."));
    }
} else {
    echo json_encode(array("error" => "Only JPG, JPEG, PNG, and GIF files are allowed."));
}

?>