<div class="ticketsLeft">
    <form method="post" action="tickets/new" style="width: 465px; height: 225px; margin: 0 auto; padding: 20px; border: 1px dotted black;">
        <label for="priority">Prioritet:</label>
        <select name="priority" id="priority">
            <option value="0">Nizak</option>
            <option value="1">Srednji</option>
            <option value="2">Visok</option>
        </select>
        <input type="text" name="title" id="title" placeholder="Naslov..." />
        <label for="type">Tip tiketa:</label>
        <select name="type" id="type">
            <option value="0">Pitanje</option>
            <option value="1">Problem</option>
            <option value="2">Sugestija</option>
        </select>
        <br />
        <label for="ticket">Pitanje:</label><br />
        <textarea name="ticket" id="ticket" style="width: 465px; height: 150px;"></textarea><br />
        <input type="submit" name="post" id="post" value="Posalji" style="float: right; width: 100px; height: 30px" />
    </form>
</div>
<div class="ticketsRight">
    <ul class="ticketsLinks">
        <li><a href="http://test.wdw-hosting.info/tickets/open">Otvoreni</a></li>
        <li><a href="http://test.wdw-hosting.info/tickets/closed">Zatvoreni</a></li>
        <li><a href="http://test.wdw-hosting.info/tickets/all">Svi</a></li>
    </ul>
</div>