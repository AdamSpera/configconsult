
function parseVLANs(config) {
  const lines = config.split('\n');
  const vlanDetails = [];
  let currentVLAN = null;

  for (let line of lines) {
    if (line.startsWith('vlan ')) {
      if (currentVLAN) {
        vlanDetails.push(currentVLAN);
      }
      const vlanId = line.split(' ')[1];
      currentVLAN = { vlanId, vlanName: '' };
    } else if (line.trim().startsWith('name ') && currentVLAN) {
      currentVLAN.vlanName = line.trim().substring(5);
    }
  }

  if (currentVLAN) {
    vlanDetails.push(currentVLAN);
  }

  return vlanDetails;
}

function maskToCIDR(mask) {
  return mask.split('.').map(octet =>
    parseInt(octet, 10).toString(2).split('1').length - 1
  ).reduce((acc, bits) => acc + bits, 0);
}

function getVLANIPAddress(config, vlanId) {
  const lines = config.split('\n');
  let foundVLAN = false;

  for (let line of lines) {
    if (line.startsWith(`interface Vlan${vlanId}`)) {
      foundVLAN = true;
    } else if (foundVLAN && line.trim().startsWith('ip address')) {
      const parts = line.trim().split(' ');
      if (parts.length >= 4) {
        const ipAddress = parts[2];
        const subnetMask = parts[3];
        return `${ipAddress}/${maskToCIDR(subnetMask)}`;
      }
    } else if (foundVLAN && !line.startsWith(' ')) {
      break;
    }
  }

  return 'Not assigned';
}

function getVLANStatus(config, vlanId) {
  const lines = config.split('\n');
  let foundVLAN = false;
  let status = 'Neutral';

  for (let line of lines) {
    if (line.startsWith(`interface Vlan${vlanId}`)) {
      foundVLAN = true;
    } else if (foundVLAN && line.trim() === 'no shutdown') {
      status = 'Active';
      break;
    } else if (foundVLAN && line.trim() === 'shutdown') {
      status = 'Disabled';
      break;
    } else if (foundVLAN && !line.startsWith(' ')) {
      break;
    }
  }

  return status;
}

function isVLANAppliedToInterface(configData, vlanNumber) {
  const lines = configData.split('\n');
  vlan = vlanNumber.vlanId;
  for (let i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if ((line.includes('switchport trunk allowed vlan '))) {
      line = line.split('vlan ')[1];

      if (line.includes('add ')) {
        line = line.split('add ')[1] + ',';
      } else {
        line = line + ',';
      }

      console.log(vlan, '----', line);
      if (line.includes(vlan + ',')) return true;
    }
  }
  return false;
}

function doVLANs(configData) {

  function logVLANs(vlanDetails, config) {
    vlanDetails.forEach(vlan => {
      const ipAddress = getVLANIPAddress(config, vlan.vlanId);
      const status = getVLANStatus(config, vlan.vlanId);

      // vlan id
      var row = $('<tr>');
      var td = $('<td>');
      var span = $('<span>');
      if (!vlan.vlanId.includes('-') && !isVLANAppliedToInterface(configData, vlan)) {
        span.css('color', 'red');
        span.css('cursor', 'pointer');
        span.on('click', function () {
          alert('VLAN ' + vlan.vlanId + ' is not explicitly (might still be within a range!) applied to any interfaces.');
        });
      }
      td.append(span.text(vlan.vlanId));
      row.append(td.append(span));

      row.append('<td>' + vlan.vlanName + '</td>');
      row.append('<td>' + ipAddress + '</td>');
      row.append('<td>' + status + '</td>');

      $('#section-vlans tbody').append(row);
    });
  }

  const vlanDetails = parseVLANs(configData);
  logVLANs(vlanDetails, configData);

};