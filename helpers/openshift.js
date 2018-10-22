const request = require('request');
const env = require('../configs/env')

module.exports = {
    // authorizeOpenshiftToken
    authorizeOpenshiftToken: function (email, password) {
        return new Promise(function (resolve) {
            let options = {
                url: env.URL_HOST + 'oauth/authorize?response_type=token&client_id=openshift-challenging-client',
                headers: {
                    'X-CSRF-Token': '1'
                },
                auth: {
                    'user': email,
                    'pass': password,
                },
                followAllRedirects: false,
                rejectUnauthorized: false,
            };

            var r = request.get(options, function () {
                var hash = r.uri.href;
                if (hash == null || hash == env.URL_HOST + 'oauth/authorize?response_type=token&client_id=openshift-challenging-client') {
                    console.log("Error : user auth problem with basic auth cannot get token");
                    var data = {
                        success: false,
                        status: 403,
                        code: 'AUTH-FAILED',
                        msg: 'Authentication Failed in Openshift Authentication.',
                        data: {
                            msg: 'Authentication Failed in Openshift Authentication.',
                            access_token: null,
                            expires_in: null,
                            scope: null,
                            token_type: null,
                        }
                    }
                    resolve(data)
                } else {
                    var result = hash.split('#');
                    result = result[1].split('&');
                    var jsonData = {};
                    for (var i = 0; i < result.length; i++) {
                        var SplitString = result[i].split('=');
                        var columnName = SplitString[0];
                        jsonData[columnName] = SplitString[1];
                    }

                    var data = {
                        success: true,
                        status: 200,
                        code: 'AUTH-SUCCESS',
                        msg: 'Authentication SUCCESS.',
                        data: jsonData
                    }
                    resolve(data);
                }
            })
        });
    }
};