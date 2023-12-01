
function parsePortChannels(config) {
  const lines = config.split('\n');
  let currentPortChannel = null;
  let portChannels = [];

  for (let line of lines) {
    if (line.startsWith('interface Port-channel')) {
      if (currentPortChannel) {
        portChannels.push(currentPortChannel);
      }
      currentPortChannel = { interfaceName: line.split(' ')[1], vlans: [] };
    } else if (currentPortChannel && line.trim().startsWith('description')) {
      currentPortChannel.description = line.trim().split(' ').slice(1).join(' ');
    } else if (currentPortChannel && line.trim().startsWith('switchport trunk allowed vlan')) {
      currentPortChannel.vlans.push(line.trim().split(' ').slice(4).join(' '));
    } else if (currentPortChannel && line.trim().startsWith('switchport trunk allowed vlan add')) {
      currentPortChannel.vlans.push(line.trim().split(' ').slice(5).join(' '));
    }
  }

  if (currentPortChannel) {
    portChannels.push(currentPortChannel);
  }

  return portChannels;
}

function getChannelGroupInterfaces(config, channelGroupNumber) {
  const lines = config.split('\n');
  let interfaces = [];

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('channel-group') && lines[i].trim().split(' ')[1].split(' ')[0].trim() == channelGroupNumber) {
      let j = i - 1;
      while (j >= 0) {
        if (lines[j].startsWith('interface')) {
          interfaces.push(lines[j].split(' ')[1]);
          break;
        }
        j--;
      }
    }
  }

  return interfaces;
}

function doPortchannels(configData) {

  function logPortChannelDetails(portChannels) {
    portChannels.forEach(pc => {
      var row = $('<tr>');
      row.append('<td>' + pc.interfaceName + '</td>');
      row.append('<td>' + pc.description + '</td>');

      // vlans
      var td = $("<td>");
      var vlans = pc.vlans.flat().join(',').split(',');
      for (var i = 0; i < vlans.length; i++) {
        var vlan = vlans[i];
        if (vlan.includes('add ')) { vlan = vlan.split('add ')[1]; }
        var span = $("<span>")
        if (!configData.includes(`vlan ${vlan}\n`) && !vlan.includes('-')) {
          span.css('color', 'red');
          span.css('cursor', 'pointer');
          span.on('click', function () {
            alert('Vlan ' + vlan + ' is not configured.\nEx. (config)# vlan ' + vlan);
          });
        }
        span.text(vlan + (i !== vlans.length - 1 ? ', ' : ''));
        td.append(span);
      }
      row.append(td);

      // members
      var td = $("<td>");
      var members = getChannelGroupInterfaces(configData, pc.interfaceName.split('Port-channel')[1]);
      for (member of members) {
        var span = $("<span>");
        span.text(member + '\n');
        td.append(span);
      }
      if (members.length < 2) {
        td.css('color', 'red');
        td.css('cursor', 'pointer');
        td.on('click', function () {
          alert('Port-channel ' + pc.interfaceName + ' does not have at least 2 members.');
        });
      }
      row.append(td);

      $('#section-portchannels tbody').append(row);
    });
  }

  const portChannels = parsePortChannels(configData);
  logPortChannelDetails(portChannels);

};