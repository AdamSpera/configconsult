
$(document).ready(function () {

  $("#submitBtn").click(function () {

    configData = $("#inputField").val();

    $("#dialogBox").hide();
    $("#overlay").hide();

    doDetails(configData);
    doVLANs(configData);
    doInterfaces(configData);
    doPortchannels(configData);

  });

});
