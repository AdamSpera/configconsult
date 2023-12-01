$(document).ready(function() {
  $("section").hide();
  $("#section-vlans").show();

  $("nav button").click(function() {
    var id = $(this).text().toLowerCase().replace(/\s/g, '');
    $("section").hide();
    $("#section-" + id).show();
  });
});