let isFileValid = false;
let isKeyValid = false;
let isFileUploading = false;
let isFileNameValid = false;
let fileName;

document.getElementById("decryptNav").classList.add("active");

$('#fileInput').on('change',function(e){
    //get the file name
    if (e.target.files[0]) {
        fileName = e.target.files[0].name;
        isFileValid = true;
        //replace the "Choose a file" label
        $(this).next('.custom-file-label').html(fileName);
        if (fileName.includes("_encrypted")) {
            $('#filenameInput').val(fileName.split("_encrypted")[0]);
            isFileNameValid = true;
        }
    } else {
        isFileValid = false;
        $('#uploadBtn').attr("disabled", true);
    }

    if (!isFileUploading && isKeyValid && isFileValid && isFileNameValid) {
        $('#uploadBtn').removeAttr("disabled");
    }
})

$('#keyInput').on('change', function(e) {
    isKeyValid = e.target.value.length > 0;
    if (!isKeyValid) {
        $('#uploadBtn').attr("disabled", true);
    }
    if (!isFileUploading && isKeyValid && isFileValid && isFileNameValid) {
        $('#uploadBtn').removeAttr("disabled");
    }
})

$('#filenameInput').on('change', function(e) {
    isFileNameValid = e.target.value.length > 0;
    if (!isFileNameValid) {
        $('#uploadBtn').attr("disabled", true);
    }
    if (!isFileUploading && isKeyValid && isFileValid && isFileNameValid) {
        $('#uploadBtn').removeAttr("disabled");
    }
})

$('#fileDecryptForm').ajaxForm({
    beforeSubmit: function () {
        isFileUploading = true;
        $('#uploadBtn').html('<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Uploading...').attr('disabled', true);
    },
    xhrFields: {
        responseType: 'blob'
    },
    success : function (responseText, statusText) {
        isFileUploading = false;
        if (isFileValid && isKeyValid && isFileNameValid) {
            $('#uploadBtn').html('Decrypt!').removeAttr("disabled");
        }
        var a = document.createElement('a');
        var url = window.URL.createObjectURL(responseText);
        a.href = url;
        a.download = $('#filenameInput').val();
        a.click();
        window.URL.revokeObjectURL(url);
        alert("File decrypted!");
    },
    error: function (response) {
        isFileUploading = false;
        if (isFileValid && isKeyValid && isFileNameValid) {
            $('#uploadBtn').html('Decrypt!').removeAttr("disabled");
        }
        console.log(response);
        alert("File not decrypted! Make sure to provide correct key!");
    }
});