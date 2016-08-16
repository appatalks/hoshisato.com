#!/bin/bash
# watchconnecions.sh v.0.0.1 Oct. 20th 2014
###############################################################################
# steven '@' stbennett.org
# hoshisato.com
# <Snapshot of Realtime Connections Information.>
#    Copyright (C) <2015>  <Steven Bennett>
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU General Public License as published by
#    the Free Software Foundation, either version 3 of the License, or
#    (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU General Public License for more details.
#
#    You should have received a copy of the GNU General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
###############################################################################
tput clear
#tput cup 3 15 # Set positional coordinates
tput rev # Set reverse video mode
echo "Active Connections"
tput sgr0 # Reset Attributes
echo " "
# HTTP
echo "Port 80 | Foreign IP Address" 
netstat -tnu 2>/dev/null | grep ':80 ' | awk '{print $5}' |sed -e 's/::ffff://' | cut -f1 -d: | sort | uniq -c | sort -rn | head
echo " "
# HTTPS
echo "Port 443 | Foreign IP Address"
netstat -tnu 2>/dev/null | grep ':443 ' | awk '{print $5}' |sed -e 's/::ffff://' | cut -f1 -d: | sort | uniq -c | sort -rn | head
echo " "
# SSH
echo "Port 22 | Foreign IP Address"
netstat -tnu 2>/dev/null | grep ':22 ' | awk '{print $5}' |sed -e 's/::ffff://' | cut -f1 -d: | sort | uniq -c | sort -rn | head
echo " "

# MySQL
echo "Port 3306 | Foreign IP Address"
netstat -tnua 2>/dev/null | grep ':3306 ' | awk '{print $5}' |sed -e 's/::ffff://' | cut -f1 -d: | sort | uniq -c | sort -rn | head
echo " "

# Connections/Port
echo "Connections/Port"
netstat -tnu 2>/dev/null | awk '{print $4}' | grep -v L | grep -v w | sed -e 's/::ffff://' | cut -f2 -d: | sort | uniq -c | sort -rn | head
###########################################
exit 0
