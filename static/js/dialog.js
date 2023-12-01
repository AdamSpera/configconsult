
var exampleConfig = `Current configuration : 3456 bytes
!
version 15.2
hostname ExampleRouter
boot system flash:packages.conf
!
ip name-server 10.160.10.15 10.160.10.16
ip domain name example.com
license boot level network-advantage
!
vtp mode server
vtp domain ExampleDomain
!
!
spanning-tree mode rapid-pvst
!
vlan 10
 name Upstream
!
vlan 20
 name Deadend
!
vlan 30
!
vlan 40
 name Admin
!
vlan 79
 name Phones
!
vlan 141
 name Marcomm
!
!
interface Vlan10
 description Sales VLAN Interface
 ip address 192.168.10.1 255.255.255.0
 no shutdown
!
interface Vlan20
 description IT VLAN Interface
 no shutdown
!
interface Vlan30
 description Marketing VLAN Interface
 ip address 192.168.30.1 255.255.255.0
 no shutdown
!
interface Vlan40
 description HR VLAN Interface
 no shutdown
!
!
interface GigabitEthernet0/0
 description Trunk to Switch A
 switchport trunk encapsulation dot1q
 channel-group 3 mode active
 switchport mode trunk
 switchport nonegotiate
!
interface GigabitEthernet0/1
 description Access port to Sales PC
 switchport mode access
 switchport access vlan 10
!
interface GigabitEthernet0/2
 description Shutdown unused port
 switchport mode trunk
 switchport trunk allowed vlan 20,40
 switchport trunk allowed vlan add 105-170
 channel-group 1 mode active
 shutdown
!
interface GigabitEthernet0/3
 description Trunk to Switch B
 switchport trunk encapsulation dot1q
 switchport mode trunk
 switchport trunk allowed vlan 10,20,30
 switchport trunk allowed vlan add 109
 channel-group 1 mode active
!
interface GigabitEthernet0/4
 description Access port to HR PC
 switchport mode access
 switchport access vlan 40
 shutdown
!
!
interface Port-channel1
 description Link Aggregation to Server
 switchport mode trunk
 switchport trunk allowed vlan 10,30
!
interface TwentyFiveGig2/1
 no shutdown
 no switchport
 ip address 192.168.1.25 255.255.255.0
!
interface TwentyFiveGig2/2
 no shutdown
 no switchport
 ip address 192.168.1.160 255.255.255.0
!
interface Port-channel2
 description Link Aggregation to Backup Server
 switchport mode access
 switchport access vlan 20
 shutdown
!
interface Port-channel3
 description Link Aggregation to Backup Server
 switchport mode access
 switchport access vlan 20
 no shutdown
!
ntp server 192.168.100.1
!
ip domain-name example.com
ip name-server 192.168.100.2
!
ip route 0.0.0.0 0.0.0.0 192.168.1.10
!
ip default-gateway 192.168.1.10
!
end`;

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

  $("#example").on("click", function () {
    $("#inputField").val(exampleConfig);
    $(this).off("click");
  });

});
