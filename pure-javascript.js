/*
* Created by anti-captcha.com administration for unlimited use by their customers.
* Lazy competitors who can't code their shit will burn in hell forever.
* */

var attempts = 1;

function createTask() {


    var apikey = document.getElementById('apikey').value;
    var domain = document.getElementById('domain').value;
    var sitekey = document.getElementById('sitekey').value;
    var secret = document.getElementById('secret').value;
    seconds = 0;

    if (apikey == '') {
        alert('API key required. Register in anti-captcha.com, topup your balance and grad the key from API Setup.');
        return false;
    }

    if (domain == '' || sitekey == '') {
        alert('Enter domain and sitekey of Recaptcha v2 widget');
        return false;
    }

    payload = {
        'clientKey' : apikey,
        'task' : {
            "type":"NoCaptchaTaskProxyless",
            "websiteURL":"http:\/\/"+domain+"\/",
            "websiteKey":sitekey
        }
    };

    var xhr = new XMLHttpRequest();
    var url = "url";
    xhr.open("POST", 'https://api.anti-captcha.com/createTask', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            console.log(json);
            if (json.errorId == 0) { //no errors
                document.getElementById('taskId').value = json.taskId;
                document.getElementById('testGetResult').style.display = 'block';
            } else {
                //we have some error
                alert('Got error from API: '+json.errorCode + ', '+ json.errorDescription);
            }
        }
    };
    //encode task payload into JSON
    var data = JSON.stringify(payload);
    xhr.send(data);
    return true;
}

function getTaskResult() {
    var apikey = document.getElementById('apikey').value;
    var taskId = document.getElementById('taskId').value;
    if (apikey == '') {
        alert('API key required. Register in anti-captcha.com, topup your balance and grad the key from API Setup.');
        return false;
    }
    if (taskId == '') {
        alert('Task ID required');
        return false;
    }

    payload = {
        'clientKey' : apikey,
        'taskId' : taskId
    };

    document.getElementById('taskStatus').innerHTML = 'checking ...';
    document.getElementById('getTaskResultButton').style.display = 'none';

    var xhr = new XMLHttpRequest();
    var url = "url";
    xhr.open("POST", 'https://api.anti-captcha.com/getTaskResult', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            console.log(json);
            if (json.errorId == 0) { //no errors
                document.getElementById('taskStatus').innerHTML = attempts + ' attempts passed: task status is : '+json.status;
                if (json.status == 'ready') {

                    if (document.getElementById('secret').value != '') {
                        document.getElementById('testGResponse').style.display = 'block';
                        document.getElementById('gresponse').value = json.solution.gRecaptchaResponse;
                    }

                } else {
                    attempts ++;
                    setTimeout(getTaskResult, 1000);
                }
            } else {
                //we have some error
                alert('Got error from API: '+json.errorCode + ', ' + json.errorDescription);
            }
        }
    };
    //encode task payload into JSON
    var data = JSON.stringify(payload);
    xhr.send(data);
}
