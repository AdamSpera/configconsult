
function getDetail(configData, search, index) {
  const lines = configData.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith(search)) {
      return lines[i].trim().split(' ')[index];
    }
  }
  return 'Not found.';
} 

function doDetails(configData) {

  function addEntryToTable(table, title, value) {
    var row = $('<tr>');
    row.append('<td>' + title + '</td>');
    row.append('<td>' + value + '</td>');
    $(`#${table}`).append(row);
  }

  addEntryToTable('device', 'Version', getDetail(configData, 'version ', 1));
  addEntryToTable('device', 'License', getDetail(configData, 'license boot level ', 3));
  addEntryToTable('device', 'Boot System', getDetail(configData, 'boot system ', 2));

  addEntryToTable('config', 'Hostname', getDetail(configData, 'hostname ', 1));
  addEntryToTable('config', 'Domain Name', getDetail(configData, 'ip domain name ', 3));
  addEntryToTable('config', 'Name Server', getDetail(configData, 'ip name-server ', 2));
  addEntryToTable('config', 'NTP Server', getDetail(configData, 'ntp server ', 2));
  addEntryToTable('config', 'Default Route', getDetail(configData, 'ip route 0.0.0.0 0.0.0.0 ', 4));
  addEntryToTable('config', 'Default Gateway', getDetail(configData, 'ip default-gateway ', 2));
  addEntryToTable('config', 'SNMP Server', getDetail(configData, 'snmp-server host ', 2));
  addEntryToTable('config', 'Logging Server', getDetail(configData, 'logging host ', 2));

};