let isFileValid = false;
let isKeyValid = false;
let isFileUploading = false;
let fileName;

document.getElementById("encryptNav").classList.add("active");

$('#fileInput').on('change',function(e){
    //get the file name
    if (e.target.files[0]) {
        fileName = e.target.files[0].name;
        isFileValid = true;
        //replace the "Choose a file" label
        $(this).next('.custom-file-label').html(fileName);
    } else {
        isFileValid = false;
        $('#uploadBtn').attr("disabled", true);
    }

    if (!isFileUploading && isKeyValid && isFileValid) {
        $('#uploadBtn').removeAttr("disabled");
    }
})

$('#keyInput').on('change', function(e) {
    isKeyValid = e.target.value.length > 0;
    if (!isKeyValid) {
        $('#uploadBtn').attr("disabled", true);
    }
    if (!isFileUploading && isKeyValid && isFileValid) {
        $('#uploadBtn').removeAttr("disabled");
    }
})

$('#fileEncryptForm').ajaxForm({
    beforeSubmit: function () {
        isFileUploading = true;
        $('#uploadBtn').html('<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Uploading...').attr('disabled', true);
    },
    xhrFields: {
        responseType: 'blob'
    },
    success : function (responseText, statusText) {
        isFileUploading = false;
        if (isFileValid && isKeyValid) {
            $('#uploadBtn').html('Encrypt!').removeAttr("disabled");
        }
        var a = document.createElement('a');
        var url = window.URL.createObjectURL(responseText);
        a.href = url;
        a.download = fileName+"_encrypted.dat";
        a.click();
        window.URL.revokeObjectURL(url);
        alert("File encrypted!");
    },
    error: function (response) {
        isFileUploading = false;
        if (isFileValid && isKeyValid) {
            $('#uploadBtn').html('Encrypt!').removeAttr("disabled");
        }
        if (response.status === 404) {
            alert("File not encrypted! Response code 404!");
        } else {
            alert("File not encrypted! Response: " + response.responseJSON.message);
        }
    }
});