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
			this.style.borderColor = 'white';
		} else {
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
			this.style.borderColor = 'white';
		} else {
			this.style.borderColor = 'red';
		}
	}

	// Handler for last name input field when loses focus
	document.getElementById("last_name").onblur = function() {
		if(  /^[A-Za-z ]+$/.test( this.value ) ) {
			console.log( 'valid last name' );
			this.style.borderColor = 'white';
		} else {
			this.style.borderColor = 'red';
		}
	}

	// Handler for email input field when loses focus
	document.getElementById("email").onblur = function() {
		if( /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test( this.value ) ) {
			console.log( 'valid email' );
			this.style.borderColor = 'white';
		} else {
			this.style.borderColor = 'red';
		}
	}

	// Handler for password input field when loses focus
	document.getElementById("password").onblur = function() {
		if( this.value.length > 5 ) {
			console.log( 'valid email' );
			this.style.borderColor = 'white';
		} else {
			this.style.borderColor = 'red';
		}
	}

	// Handler for repeat password input field when loses focus
	document.getElementById("repeat_password").onblur = function() {
		if( this.value == document.getElementById("password")  ) {
			console.log( 'valid pass combination' );
			this.style.borderColor = 'white';
		} else {
			this.style.borderColor = 'red';
		}
	}


}

