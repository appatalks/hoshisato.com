#
# auth.sh v.0.0.1 Oct. 20th 2014
#
# Place the if - fi statements into a file in /etc/profile.d/auth.sh, assuming /etc/bashrc has that configured.
# Replace Email with your email.
#
# Usage: curl -s http://hoshisato.com/tools/code/auth.sh > /etc/profile.d/auth.sh && 
#        sed -i 's/destination-email/example@example.com/g' /etc/profile.d/auth.sh
#
#
############################################################################
# steven '@' stbennett.org
# hoshisato.com
# <Send email for every authenticated SSH Login.>
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
############################################################################
if [ -n "$SSH_CLIENT" ]; then
    TEXT="$(date): ssh login to ${USER}@$(hostname -f)"
    TEXT="$TEXT from $(echo $SSH_CLIENT|awk '{print $1}')"
    echo $TEXT|mail -s "ssh login" destination-email
fi
############################################################################
