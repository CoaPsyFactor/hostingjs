<div class="panel panel-default panel-left">
    <!-- Default panel contents -->
    <div class="panel-heading">Registracija korisnika</div>
    <div class="panel-body">
        <form method="post" id="register" >

            <div class="col-lg-6">
                <div class="input-group">
                    <span class="input-group-addon">Ime i Prezime</span>
                    <input id="name" name="name" class="form-control" type="text" /> <br />
                </div>
                <label for="name" class="error" style="display: none;"></label><br />
                <br />
                <div class="input-group">
                    <span class="input-group-addon">Email</span>
                    <input id="email" name="email" class="form-control" type="text" /> <br />
                </div>
                <label for="email" class="error" style="display: none;"></label><br />
                <br />
                <div class="input-group">
                    <span class="input-group-addon">Grad</span>
                    <input id="city" name="city" class="form-control" type="text" /> <br />
                </div>
                <label for="city" class="error" style="display: none;"></label><br />
                <br />
                <div class="input-group">
                    <span class="input-group-addon">Drzava</span>
                    <select id="country" class="form-control" name="country">
                        <option selected="selected" value="0">Odaberite Drzavu</option>
                        <option value="1">Srbija</option>
                        <option value="2">Hrvatska</option>
                        <option value="3">Crna Gora</option>
                        <option value="4">Makedonija</option>
                        <option value="5">BiH</option>
                    </select>
                </div>
                <label for="country" class="error" style="display: none;"></label><br />
            </div>
            <div class="col-lg-6">
                <div class="input-group">
                    <span class="input-group-addon">Username</span>
                    <input id="username" class="form-control" name="username" type="text" />
                </div>
                <label for="username" class="error" style="display: none;"></label><br />
                <br />
                <div class="input-group">
                    <span class="input-group-addon">Lozinka</span>
                    <input id="password_reg" class="form-control" type="password" name="password_reg" type="text" />
                </div>
                <label for="password_reg" class="error" style="display: none;"></label><br />
                <br />
                <div class="input-group">
                    <span class="input-group-addon">Ponovi</span>
                    <input class="form-control" type="password" name="repassword" id="repassword" type="text" />
                </div>
                <label for="repassword" class="error" style="display: none;"></label><br />
                <br />
                <input class="btn btn-primary btn-lg" value="Registracija" name="register" type="submit">
            </div>
        </form>
    </div>
</div>
<script type="text/javascript">
    formIsOk = $('form#register').validate({
        rules: {
            username: {
                required: true,
                minlength: 3,
                maxlength: 64
            },
            name: {
                required: true,
                minlength: 3,
                maxlength: 64
            },
            email: {
                required: true,
                minlength: 6,
                maxlength: 128,
                email: true
            },
            city: {
                required: true,
                minlength: 2,
                maxlength: 24
            },
            country: {
                required: true,
                min: 1,
                max: 5
            },
            password_reg: {
                required: true,
                minlength: 6
            },
            repassword: {
                equalTo: '#password_reg'
            }
        },
        messages: {
            username: {
                required: 'korisnicko ime je obavezno',
                minlength: 'korisnicko ime je kratko',
                maxlength: 'korisnicko ime je dugacko'
            },
            name: {
                required: 'ime je obavezno',
                minlength: 'ime je kratko',
                maxlength: 'ime je dugacko'
            },
            email: {
                required: 'email je obavezan',
                minlength: 'email je kratak',
                maxlength: 'email je dugacak'
            },
            city: {
                required: 'grad je obavezan',
                minlength: 'ime grada je kratko',
                maxlength: 'ime grada je dugacko'
            },
            country: {
                required: 'drzava je obavezna',
                min: 'odaberi neku drzavu',
                max: 'drzava nije validna'
            },
            password_reg: {
                required: 'lozinka je obavezna',
                minlength: 'lozinka mora imati bar 6 karaktera'
            },
            repassword: {
                minlength: 'minimum 6 karaktera',
                equalTo: 'lozinke se ne poklapaju'
            }
        }
    });
</script>
