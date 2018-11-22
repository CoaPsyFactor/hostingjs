<div class="panel panel-default panel-left">
  <div class="panel-heading text-left">
    Otvori Novi Tiket
    <b>
      <span id="customer_name">
      </span>
    </b>
  </div>
  <div class="panel-body">
    <form method="post" action="tickets/new">
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
</div>
