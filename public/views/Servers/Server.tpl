<div class="server_main">
    <div class="server_item" >
        <fieldset style="font-size: 10px; width: 695px; float: left; height: 70px">
            <legend>Status</legend>
            <span class="server_info_name">:name:<i id="status_  :id " class="fa fa-circle" style="font-size: 12px; vertical-align: middle; color: silver;"></i></span><br />
            <span class="ip">85.25.109.123</span><span class="server_info_port">::port:</span>
            <span class="server_info_slots">:slots:</span>
        </fieldset>
        <fieldset style="font-size: 10px; width: 210px; float: right; height: 70px;"><legend>FTP</legend>User: <span class="server_info_user">:ftpuser:</span><br />
            Pass: <span class="server_info_password"> :ftppassword: </span><br />
        </fieldset>
    </div>
    <div class="server_command" >
        <ul>
            <li>
                <a onclick="SendAjax('/api/servers/restart/:id:'); return false;" href="/api/servers/restart/:id:">
                    <i class="fa fa-refresh"></i>
                </a>
            </li>
            <li>
                <a onclick="SendAjax('/api/servers/stop/:id:'); return false;" href="/api/servers/stop/:id:">
                    <i class="fa fa-power-off"></i>
                </a>
            </li>
            <li>
                <a href="/servers/ftp/:id:">
                    <i class="fa fa-upload"></i>
                </a>
            </li>
            <li>
                <a href="/servers/config/:id:">
                    <i class="fa fa-file-text"></i>
                </a>
            </li>
        </ul>
    </div>
</div>
