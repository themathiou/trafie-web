//GENERAL VIARABLES


/********************************************/
/* 				EVENTS HANDLERS				*/
/********************************************/


/**
 * loginHandlers() : handlers in login page
 */
function loginHandlers() {

	// Handler for email input field when loses focus
	document.getElementById("email_input").onblur = function() {
		if( /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test( this.value ) ) {
			console.log( 'valid email' );
			document.getElementById("email_error").innerHTML = "";
			this.style.borderColor = 'white';
		} else {
			document.getElementById("email_error").innerHTML = "Are you sure that this is a valid email?";
			this.style.borderColor = 'red';
		}
	}

	// Handler for password input field when loses focus
	document.getElementById("password_input").onblur = function() {
		if( this.value.length > 5 ) {
			console.log( 'valid email' );
			this.style.borderColor = 'white';
		} else {
			this.style.borderColor = 'red';
		}
	}


}


/**
 * registerHandlers() : handlers in login page
 */
function registerHandlers() {

	// Handler for first name input field when loses focus
	document.getElementById("first_name").onblur = function() {
		if(  /^[A-Za-z ]+$/.test( this.value ) ) {
			console.log( 'valid first name' );
			document.getElementById("first_name_error").className = "info";
			this.style.borderColor = 'green';
		} else {
			document.getElementById("first_name_error").className = "warning_message";
			this.style.borderColor = 'red';
		}
	}

	// Handler for last name input field when loses focus
	document.getElementById("last_name").onblur = function() {
		if(  /^[A-Za-z ]+$/.test( this.value ) ) {
			console.log( 'valid last name' );
			document.getElementById("last_name_error").className = "info";
			this.style.borderColor = 'green';
		} else {
			document.getElementById("last_name_error").className = "warning_message";
			this.style.borderColor = 'red';
		}
	}

	// Handler for email input field when loses focus
	document.getElementById("email").onblur = function() {
		if( /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test( this.value ) ) {
			console.log( 'valid email' );
			document.getElementById("email_error").innerHTML = "";
			this.style.borderColor = 'green';
		} else {
			document.getElementById("email_error").innerHTML = "Are you sure that this is a valid email?";
			this.style.borderColor = 'red';
		}
	}

	// Handler for password input field when loses focus
	document.getElementById("password").onblur = function() {
		if( this.value.length > 5 ) {
			console.log( 'valid email' );
			document.getElementById("password_error").className = "info";
			this.style.borderColor = 'green';
		} else {
			document.getElementById("password_error").className = "warning_message";
			this.style.borderColor = 'red';
		}
	}

	// Handler for repeat password input field when loses focus
	document.getElementById("repeat_password").onkeyup = function() {
		if( this.value == document.getElementById("password").value  ) {
			console.log( 'valid pass combination' );
			document.getElementById("repeat_password_error").innerHTML = "";
			this.style.borderColor = 'green';
		} else {
			document.getElementById("repeat_password_error").innerHTML = "Passwords doesn't match";
			this.style.borderColor = 'red';
		}
	}


}

