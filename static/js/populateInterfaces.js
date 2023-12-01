
function parseInterfaces(config) {
  const lines = config.split('\n');
  const interfaces = [];
  let currentInterface = null;

  for (let line of lines) {
    if (line.startsWith('interface ') && !line.includes('Vlan') && !line.includes('Port-channel')) {
      if (currentInterface) {
        interfaces.push(currentInterface);
      }
      const interfaceName = line.split(' ')[1];
      currentInterface = { interfaceName, description: '', ipAddress: '', switchportMode: '', vlans: '', pchannel: '' };
    } else if (currentInterface) {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('description')) {
        currentInterface.description = trimmedLine.substring(12);
      } else if (trimmedLine.startsWith('ip address')) {
        currentInterface.ipAddress = getInterfaceIPAddress(trimmedLine);
      } else if (trimmedLine.startsWith('switchport mode')) {
        currentInterface.switchportMode = trimmedLine.split(' ')[2];
      } else if (trimmedLine.startsWith('switchport access vlan')) {
        currentInterface.vlans = trimmedLine.split(' ')[3];
      } else if (trimmedLine.startsWith('switchport trunk allowed vlan')) {
        const vlanPart = trimmedLine.substring(29);
        currentInterface.vlans = currentInterface.vlans ? currentInterface.vlans + ',' + vlanPart : vlanPart;
      } else if (trimmedLine === 'no switchport') {
        currentInterface.switchportMode = 'no switchport';
      } else if (trimmedLine.includes('channel-group')) {
        currentInterface.pchannel = trimmedLine.split(' ')[1].split(' ')[0];
      }
    }
  }

  if (currentInterface) {
    interfaces.push(currentInterface);
  }

  return interfaces;
}

function getInterfaceIPAddress(line) {
  const parts = line.trim().split(' ');
  return parts.length >= 4 ? `${parts[2]}\n${parts[3]}` : 'Not assigned';
}

function doInterfaces(configData) {

  function logInterfaceDetails(interfaces) {
    interfaces.forEach(intf => {
      var row = $('<tr>');
      row.append('<td>' + intf.interfaceName + '</td>');
      row.append('<td>' + intf.description + '</td>');
      row.append('<td>' + intf.switchportMode + '</td>');
      row.append('<td>' + intf.ipAddress + '</td>');

      // vlans
      var td = $("<td>");
      var vlans = intf.vlans.split(',');
      console.log(vlans);
      
      for (let i = 0; i < vlans.length; i++) {
        let vlan = vlans[i].trim();
        if (vlan.includes('add ')) { vlan = vlan.split('add ')[1]; }
      
        let span = $("<span>")
        if (vlan.includes('-')) {
          let range = vlan.split('-');
          let start = parseInt(range[0]);
          let end = parseInt(range[1]);
          let isYellow = false;
          for (let j = start; j <= end; j++) {
            if (!configData.includes(`vlan ${j}\n`)) {
              isYellow = true;
              break;
            }
          }
          if (isYellow) {
            span.css('color', 'orange');
            span.css('cursor', 'pointer');
            span.on('click', (function(vlan) {
              return function() {
                alert('At least one VLAN in the range ' + vlan + ' is not configured.\nEx. (config)# vlan ' + vlan);
              };
            })(vlan));
          }
        } else if (!configData.includes(`vlan ${vlan}\n`)) { 
          span.css('color', 'red'); 
          span.css('cursor', 'pointer');
          span.on('click', (function(vlan) {
            return function() {
              alert('Vlan ' + vlan + ' is not configured.\nEx. (config)# vlan ' + vlan);
            };
          })(vlan));
        }
        span.text(vlan + (i !== vlans.length - 1 ? ', ' : ''));
        td.append(span);
      }
      row.append(td);

      // port-channel
      var td = $("<td>");
      var span = $("<span>");
      if (!configData.includes(`interface Port-channel${intf.pchannel}\n`)) { 
        span.css('color', 'red'); 
        span.css('cursor', 'pointer');
        span.on('click', function () {
          alert('The Port-channel' + intf.pchannel + ' interface is not configured.');
        });
      }
      span.text(intf.pchannel);
      td.append(span);
      row.append(td);


      $('#section-interfaces tbody').append(row);
    });
  }

  const interfaces = parseInterfaces(configData);
  logInterfaceDetails(interfaces);

};