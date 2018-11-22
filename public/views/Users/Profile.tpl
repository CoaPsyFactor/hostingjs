<div class="panel panel-default panel-left">
  <div class="panel-heading text-left">
    Korisnik:
    <b>
      <span id="customer_name">
      </span>
    </b>
  </div>
  <div class="panel-body">
    <div class="col-md-6 col-md-offset-3 text-center">
    <form method="post" id="profile" >
      <div class="input-group">
          <span class="input-group-addon">Ime i Prezime: </span>
          <input id="name" name="name" disabled="disabled" class="form-control" type="text" /> <br />
      </div><br />
      <div class="input-group">
          <span class="input-group-addon">Email Adresa: </span>
          <input id="email" name="email" class="form-control" type="text" disabled="disabled"/> <br />
      </div><br />
      <div class="input-group">
          <span class="input-group-addon">Lozinka: </span>
          <input id="password" name="password" class="form-control" type="password" /> <br />
      </div><br />
      <div class="input-group">
          <span class="input-group-addon">Ponoviti: </span>
          <input id="repassword" name="repassword" class="form-control" type="password" /> <br />
      </div><br /><br />
      <div class="input-group">
          <span class="input-group-addon">Trenutna: </span>
          <input id="currentpassword" name="currentpassword" class="form-control" type="password" /> <br />
      </div><br />
       <button disabled="disabled" type="submit" class="btn btn-primary">Sacuvaj</button>
    </form>
  </div>
  </div>
</div>
<script type="text/javascript" src="/js/profile_load.js"></script>
