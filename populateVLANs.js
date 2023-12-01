
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

function doVLANs(configData) {

  function logVLANs(vlanDetails, config) {
    vlanDetails.forEach(vlan => {
      const ipAddress = getVLANIPAddress(config, vlan.vlanId);
      const status = getVLANStatus(config, vlan.vlanId);

      var row = $('<tr>');
      row.append('<td>' + vlan.vlanId + '</td>');
      row.append('<td>' + vlan.vlanName + '</td>');
      row.append('<td>' + ipAddress + '</td>');
      row.append('<td>' + status + '</td>');

      $('#section-vlans tbody').append(row);
    });
  }

  const vlanDetails = parseVLANs(configData);
  logVLANs(vlanDetails, configData);

};