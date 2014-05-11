var Profile = require('../models/profile.js'),
    Activity = require('../models/activity.js'),
    User = require('../models/user.js'),
    counter = 0,
    start_time,
    names = ['Huong','Signe','Kalyn','Coleen','Trinity','Mikel','Starla','Suzan','Shamika','Tyisha','Christia','Louie','Guadalupe','Dot','Delilah','Henry','Vinita','Rich','Hugo','Dawne','Laila','Emanuel','Melodee','Tiera','Blythe','Chadwick','Avelina','Lavette','Henriette','Tonia','Treasa','Marin','Lien','Karen','Eugenia','Kathie','Sandi','Estell','Tamesha','Noel','Dreama','Taylor','Pearlie','Velia','Millie','Frederick','Ashleigh','Dorthea','Erlene','Virgie','Vernie','Mistie','Herlinda','Verline','Letitia','Gracia','Tonita','Dick','Kayce','Bridgett','Many','Lucas','Elvera','Wilton','Arline','Edmundo','Iliana','Karry','Rina','Marcelo','Lanette','Viviana','Annalisa','Lacie','Paula','Torie','Lloyd','Shaquana','Salley','Renna','Kayleen','Jack','Ela','Carson','Emelda','Agripina','Machelle','Dorla','Keena','Andre','Clora','Manual','Latonya','Tasha','Valrie','Sonya','Adina','Cordelia','Johnson','Assunta','Argentina','Siu','Clorinda','Megan','Victoria','Rosann','Gearldine','Shaunta','Florentina','Terrence','Fletcher','Jeanelle','Margherita','Angelica','Tesha','Anabel','Bonny','Juliet','Stephnie','Brenna','Paul','Jaimee','Ivette','Romelia','Roxane','Kelsey','Sherrie','Sebrina','Israel','Britta','Aurelio','Larhonda','Dan','Adria','Jeane','Estefana','Catherina','Alisia','Maxie','Yong','Aleen','Tisha','Shaunte','Valentina','Dierdre','Dante','Elsie','Pansy','Evelina','Felix','Tuan','Tressa','Delora','Valorie','Minnie','Alica','Santana','Lecia','Leta','Clinton','Margart','Crystle','Myron','Tarah','Demetrius','Hyman','Nakia','Tonie','Bernarda','Charlette','Jestine','Lane','Chase','Refugia','Marquerite','Anton','Evelyne','Chere','Nadine','Armandina','Charleen','Song','Luella','Sherita','Rosalie','Gisela','Georgetta','Daisey','Glenn','Tianna','Olympia','Lamont','Nena','Danille','Forest','Shantel','Han','Daniel','Yesenia','Xenia','Sheridan','Tam','Leatha','Renay','Camilla','Maribel','Ernestina','Casimira','Philip','Jacki','Queen','Mana','Haywood','Cassie','Mollie','Max','Jaquelyn','Zoila','Odilia','Jonnie','Duncan','Collene','Angelyn','Molly','Darell','Loriann','Lasandra','Shanita','Lahoma','Marya','Corie','Kristal','Doris','Cleo','Kristi','Jared','Don','Nathaniel','Regine','Takisha','Jeanna','Maida','Catheryn','Jacquetta','Tommy','Christoper','Magaly','Elvin','Franklyn','Margaret','Stefany','Chrystal','Sherill','Gemma','Samual','Stephania','Geraldo','Shira','Rea','Babette','Tera','Samara','Vennie','Sheldon','Gretta','Windy','Reva','Meridith','Eleonore','Domenica','Alphonso','John','Dania','Norris','Ariel','Nicolas','Callie','Antione','Annetta','Tamika','Ann','Natosha','Jerilyn','Natasha','Juliette','Tom','Miguelina','Jeanne','Rima','Delaine','Inge','Louvenia','Gaynell','Chante','Donita','Bernita','Floria','Jenni','Suzy','Alexia','Violet','Merle','Louis','Frederica','Ron','Terri','Marcos','Burl','Regena','Candra','Zelda','Shawna','Kelsie','Daniella','Gia','Theo','Laurine','Kali','Cecil','Ozie','Lindsey','Theda','Christina','Evan','Dinah','Robt','Houston','Theodore','Amparo','Arturo','Maria','Fredricka','Shirl','Man','Felicia','Jonelle','Jodi','Lacresha','Nelle','Nickie','Nilsa','Annemarie','Johnsie','Milissa','Anastasia','Ned','Tomiko','Ressie','Brandee','Carisa','Wanetta','Nadene','Garland','Cortez','Saul','Winford','Erica','Irwin','Levi','Sam','Carina','Lillian','Milford','Augustus','Jamaal','Birgit','Chaya','Moira','Beckie','Lue','My','Jasmine','Nettie','Marylynn','Dian','Clarine','Micheline','Rodrigo','Karrie','Savanna','Natashia','Shawnee','Enda','Melody','Lakesha','Daniela','Kanesha','Madaline','Ardelle','Quinton','Jacqulyn','Peg','Maynard','Nikia','Delicia','Samuel','Thurman','Talitha','Anneliese','Tracie','Janel','Halley','Candance','Minh','Neville','Rosenda','Isidra','Judie','Wanda','Charity','Bong','Georgianne','Terry','Leisa','Dillon','Jamika','Shaniqua','Gerard','Lelah','Ceola','Willetta','Colene','Royce','Chas','Abigail','Felicidad','Livia','Sharice','Daisy','Ulrike','Maren','Trina','Daphne','Nola','Gabriele','Lauralee','Hana','Sandy','Margy','Peggy','Shanon','Verlene','Joann','Concetta','Cornelius','Maybell','Colby','Jule','Kendra','Emely','Dorathy','Cindie','Jacelyn','Regenia','Vasiliki','Tenisha','Ronald','Cleveland','Tommie','Jacquelin','Wilber','Leanne','Hedy','Andy','Jacquline','Judson','Kym','Emelia','Von','Chauncey','Lawanda','Dewitt','Neely','Shonna','Wilbert','Leona','Lianne','Carmen','Deb','Eveline','Sharie','Charline','Jere','Odessa','Minna','Paz','Kathryne','Harley','Lucy','Davida','Neta','Hershel','Freida','Sana','Breann','Joycelyn','Amos','Rosa','Kala','Neoma','Lynelle','Darleen','Kecia','Kandy','Amada','Aja','Jacques','Eldridge','Beryl','Lou','Kay','Yu','Awilda','Helen','Hung','Bertram','Keitha','Claud','Tambra','Marilou','Caren','Domitila','Eusebia','Yelena','Hoa','Loree','Adeline','Therese','Eugene','Chung','Oretha','Vikki','Ilona','Abraham','Marquita','Wynell','Dewey','Carter','Yuette','Tari','Nana','Deloris','Robby','Bao','Marisha','Dirk','Francis','Candice','Linwood','Sona','Leopoldo','Corrie','Eulalia','Stella','Venus','Gita','Rebecca','Shakia','Brenda','Wes','Clyde','Maryanna','Lavenia','Enoch','Lavonna','Ahmed','Earlean','Caterina','Chuck','Deeann','Minda','Daina','Lillie','Carletta','Albert','Arlen','Porsche','Erich','Ettie','Denita','Noelia','Melani','Debbra','Jade','Osvaldo','Lizbeth','Ayana','Eartha','Zofia','Paulina','Jackeline','Edgardo','Pattie','Billye','Carlie','Josue','Cordell','Aldo','Terra','Hertha','Lovella','Charissa','Kristeen','Lilian','Orville','Clarinda','Cassey','Myrle','Katlyn','Danica','Liana','Angele','August','Alverta','Kitty','Ezra','Briana','Mckinley','Raina','Maryland','Lizzette','Selene','Merna','Duane','Shayna','Adriana','Virgen','Brandi','Jacquiline','Kaylee','Willodean','Taina','Johnetta','Georgie','Foster','Heather','Tegan','Benedict','Sherron','Hope','Wendy','Jeanette','Elvira','Leandra','Jonah','Gwenda','Milan','Mariel','Shelli','Donna','Pearly','Eliana','Maddie','Carolina','Elin','Ingeborg','Katherine','Meryl','Jackqueline','Nickolas','Josephina','Scot','Lakeesha','Krysten','Amee','Yolando','Sanora','Ursula','Fermin','Yung','Vivien','Reta','Ciara','Merrie','Pamila','Venita','Tiesha','Kathe','Tyesha','Denise','Gisele','Maurita','Kathrine','Prince','Selina','Joan','Sook','Vania','Margit','Rebeca','Ginger','Delmer','Sol','Morris','Guillermina','Joaquin','Svetlana','Nora','Dean','Dixie','Kirstin','Abe','Glinda','Jannie','Gilberto','Tiana','Emil','Shiloh','Taneka','Rodrick','Nolan','Leonor','Tonya','Karla','Hiram','Ludivina','Berna','Emory','Loreta','Alona','Maricruz','Dee','Leanora','Christel','Bill','Robert','Vanesa','Amberly','Samella','Myra','Nguyet','Felipa','Jaymie','Chet','Lyda','Cathie','Bok','Elisabeth','Tifany','Santa','Dorothea','Andree','Douglas','Maryrose','Sparkle','Abel','Cherise','Keesha','Oswaldo','Dani','Christena','Stacey','Verdell','Antwan','Gabriela','Marvin','Herman','Paris','Dede','Benny','Clement','Julian','Willette','Garret','Magan','Kathline','Lorretta','Freeda','Donny','Jacqui','Socorro','Lindsy','Madeleine','Milagro','Alba','Jenine','Chia','Nancie','Ira','Retha','Coralie','Coletta','Gilda','Doretha','Taryn','Monnie','Saundra','Jennie','Winter','Elsa','Burma','Cedric','Maple','Shirleen','Ruthe','Jonna','Lonnie','Hiroko','Kasie','Verdie','Soledad','Latrina','Penelope','Lois','Renaldo','Christine','Stacia','Mikaela','Marivel','Rheba','Agnes','Thanh','Carlton','Alesia','Trudi','Evon','Criselda','Tory','Elna','Sima','Roseann','Lovie','Donette','Rosaline','Temeka','Vicenta','Sang','Janice','Kiera','Una','Marta','Oren','Delana','Louann','Anjanette','Filomena','Audry','Mitzie','Lucienne','Cammie','Jennine','Ngoc','Harlan','Na','Teodoro','Ofelia','Kerrie','Kimberlee','Mireille','Evette','William','Lucien','Randall','Ninfa','Ferdinand','Connie','Elana','Rudy','Kaylene','Arcelia','Ricky','Norene','Deanna','Laurinda','Cassandra','Merrilee','Katelynn','Keri','Madonna','Edra','Zenaida','Marna','Lindy','Berneice','Emerald','Jillian','Odette','Margrett','Trish','Raguel','Bonnie','Cami','Sheryll','Rogelio','Ivonne','Marisa','Corine','Brendan','Lakeshia','Adalberto','Nerissa','Henrietta','Franklin','Serena','Wendi','Marilynn','Magali','Brooke','Lesha','Willena','Jenae','Shante','Marcell','Annie','Cherri','Petra','Milton','Brandy','Tuyet','Gavin','Russel','Dannie','Bernadine','Thomasena','Bonita','Shanelle','Misha','Armanda','Delpha','Joye','Claudia','Mee','Julius','Shona','Lawanna','Eva','Jonathan','Perla','Arianne','Kia','Ashlie','Thuy','Sherlene','Jeramy','Cythia','Richard','Arlie','Piper','Tarra','Edwin','Kieth','Delsie','Shirlee','Isabelle','Adrianne','Reita','Clementina','Holli','Amelia','Fausto','Darcel','Wally','Hallie','Stewart','Veronika','Clotilde','Emilia','Elba','Wilhemina','Jerold','Gilbert','Sonja','Joanne','Tama','Inell','Lupe','Erline','Darron','Honey','Scott','Raymon','Darline','Wayne','Lizabeth','Desire','Felipe','Izetta','Miranda','Bruna','Shiela','Louella','Titus','Myles','Rey','Ethelyn','Luis','Leia','Lory','Marietta','Rose','Benton','Dulcie','Ute','Kylie','Earline','Frederic','Beverly','Andrea','Marline','Gabriel','Sandee'];

exports.get = function( req, res ) {
	res.send('\
		<html>\
			<body>\
				<form method="POST">\
					Give me <input type="text" name="number_of_users"> users\
					<input type="submit" value="Go!">\
				</form>\
				<form method="POST">\
					Delete all users\
					<input type="submit" name="delete_all_users" value="Go!">\
				</form>\
			</body>\
		</html>\
	');
}

exports.post = function( req, res ) {
	if( typeof req.body.number_of_users !== 'undefined' ) {
		start_time = ~~( Date.now() / 1000 );
		create_user( req.body.number_of_users, res );
	}
	else if( typeof req.body.delete_all_users !== 'undefined' ) {
		User.collection.remove( function(){

			Profile.collection.remove( function(){

				res.send('\
					<html>\
						<body>\
							<form method="POST">\
								Give me <input type="text" name="number_of_users"> users\
								<input type="submit" value="Go!">\
							</form>\
							<form method="POST">\
								Delete all users\
								<input type="submit" name="delete_all_users" value="Go!">\
							</form>\
						</body>\
					</html>\
				');
			});

		});
		

	}
}

function create_user( max_users, res ) {
	if( counter < max_users ) {
		var random_index = ~~( Math.random() * names.length );
		var first_name = names[random_index];

		var random_index = ~~( Math.random() * names.length );
		var last_name = names[random_index];

		var delimiter = ~~( Math.random() * 2 ) ? '.' : '_';

	    var new_user = {
	      'email': first_name.toLowerCase() + delimiter + last_name.toLowerCase() + (~~( Math.random() * 10000 ) ) +'@trafie.com',
	      'password': User.schema.encryptPassword('123123'),
	      'valid': true
	    };

	    if( ~~( Math.random() * 2 ) ) {
		    var new_profile = {
		      'first_name': first_name,
		      'last_name': last_name,
		      'username': first_name.toLowerCase() + delimiter + last_name.toLowerCase() + (~~( Math.random() * 10000 ) )
		    };
	    } else {
	    	var random_index = ~~( Math.random() * names.length );
			var middle_name = names[random_index];

	    	var new_profile = {
		      'first_name': first_name,
		      'last_name': middle_name + ' ' + last_name,
		      'username': first_name.toLowerCase() + delimiter + last_name.toLowerCase() + (~~( Math.random() * 10000 ) )
		    };
	    }

	    // Creating the user and profile objects
	    var user = new User( new_user );

	    // Saving the user and the profile data
	    user.save(function ( err, user ) {
	      new_profile._id = user._id;
	      var profile = new Profile( new_profile );
	      Profile.schema.save( profile )
	      .then( function(){
	      	counter++;
	      	create_user( max_users, res );
	      });
		});
	} else {
		var time = ~~( Date.now() / 1000 ) - start_time;

		res.send('\
			<html>\
				<body>\
					<p>Done in ' + time + ' seconds</p>\
					<form method="POST">\
						Give me <input type="text" name="number_of_users"> users\
						<input type="submit" value="Go!">\
					</form>\
					<form method="POST">\
						Delete all users\
						<input type="submit" name="delete_all_users" value="Go!">\
					</form>\
				</body>\
			</html>\
		');
	}
}