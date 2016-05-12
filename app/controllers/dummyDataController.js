'use strict';

var moment = require('moment'),
    Profile = require('../models/profileModel'),
    Activity = require('../models/activityModel'),
    User = require('../models/userModel'),
    counter = 0,
    start_time,
    userHelper = require('../helpers/userHelper'),
    names = ['Huong', 'Signe', 'Kalyn', 'Coleen', 'Trinity', 'Mikel', 'Starla', 'Suzan', 'Shamika', 'Tyisha', 'Christia', 'Louie', 'Guadalupe', 'Dot', 'Delilah', 'Henry', 'Vinita', 'Rich', 'Hugo', 'Dawne', 'Laila', 'Emanuel', 'Melodee', 'Tiera', 'Blythe', 'Chadwick', 'Avelina', 'Lavette', 'Henriette', 'Tonia', 'Treasa', 'Marin', 'Lien', 'Karen', 'Eugenia', 'Kathie', 'Sandi', 'Estell', 'Tamesha', 'Noel', 'Dreama', 'Taylor', 'Pearlie', 'Velia', 'Millie', 'Frederick', 'Ashleigh', 'Dorthea', 'Erlene', 'Virgie', 'Vernie', 'Mistie', 'Herlinda', 'Verline', 'Letitia', 'Gracia', 'Tonita', 'Dick', 'Kayce', 'Bridgett', 'Many', 'Lucas', 'Elvera', 'Wilton', 'Arline', 'Edmundo', 'Iliana', 'Karry', 'Rina', 'Marcelo', 'Lanette', 'Viviana', 'Annalisa', 'Lacie', 'Paula', 'Torie', 'Lloyd', 'Shaquana', 'Salley', 'Renna', 'Kayleen', 'Jack', 'Ela', 'Carson', 'Emelda', 'Agripina', 'Machelle', 'Dorla', 'Keena', 'Andre', 'Clora', 'Manual', 'Latonya', 'Tasha', 'Valrie', 'Sonya', 'Adina', 'Cordelia', 'Johnson', 'Assunta', 'Argentina', 'Siu', 'Clorinda', 'Megan', 'Victoria', 'Rosann', 'Gearldine', 'Shaunta', 'Florentina', 'Terrence', 'Fletcher', 'Jeanelle', 'Margherita', 'Angelica', 'Tesha', 'Anabel', 'Bonny', 'Juliet', 'Stephnie', 'Brenna', 'Paul', 'Jaimee', 'Ivette', 'Romelia', 'Roxane', 'Kelsey', 'Sherrie', 'Sebrina', 'Israel', 'Britta', 'Aurelio', 'Larhonda', 'Dan', 'Adria', 'Jeane', 'Estefana', 'Catherina', 'Alisia', 'Maxie', 'Yong', 'Aleen', 'Tisha', 'Shaunte', 'Valentina', 'Dierdre', 'Dante', 'Elsie', 'Pansy', 'Evelina', 'Felix', 'Tuan', 'Tressa', 'Delora', 'Valorie', 'Minnie', 'Alica', 'Santana', 'Lecia', 'Leta', 'Clinton', 'Margart', 'Crystle', 'Myron', 'Tarah', 'Demetrius', 'Hyman', 'Nakia', 'Tonie', 'Bernarda', 'Charlette', 'Jestine', 'Lane', 'Chase', 'Refugia', 'Marquerite', 'Anton', 'Evelyne', 'Chere', 'Nadine', 'Armandina', 'Charleen', 'Song', 'Luella', 'Sherita', 'Rosalie', 'Gisela', 'Georgetta', 'Daisey', 'Glenn', 'Tianna', 'Olympia', 'Lamont', 'Nena', 'Danille', 'Forest', 'Shantel', 'Han', 'Daniel', 'Yesenia', 'Xenia', 'Sheridan', 'Tam', 'Leatha', 'Renay', 'Camilla', 'Maribel', 'Ernestina', 'Casimira', 'Philip', 'Jacki', 'Queen', 'Mana', 'Haywood', 'Cassie', 'Mollie', 'Max', 'Jaquelyn', 'Zoila', 'Odilia', 'Jonnie', 'Duncan', 'Collene', 'Angelyn', 'Molly', 'Darell', 'Loriann', 'Lasandra', 'Shanita', 'Lahoma', 'Marya', 'Corie', 'Kristal', 'Doris', 'Cleo', 'Kristi', 'Jared', 'Don', 'Nathaniel', 'Regine', 'Takisha', 'Jeanna', 'Maida', 'Catheryn', 'Jacquetta', 'Tommy', 'Christoper', 'Magaly', 'Elvin', 'Franklyn', 'Margaret', 'Stefany', 'Chrystal', 'Sherill', 'Gemma', 'Samual', 'Stephania', 'Geraldo', 'Shira', 'Rea', 'Babette', 'Tera', 'Samara', 'Vennie', 'Sheldon', 'Gretta', 'Windy', 'Reva', 'Meridith', 'Eleonore', 'Domenica', 'Alphonso', 'John', 'Dania', 'Norris', 'Ariel', 'Nicolas', 'Callie', 'Antione', 'Annetta', 'Tamika', 'Ann', 'Natosha', 'Jerilyn', 'Natasha', 'Juliette', 'Tom', 'Miguelina', 'Jeanne', 'Rima', 'Delaine', 'Inge', 'Louvenia', 'Gaynell', 'Chante', 'Donita', 'Bernita', 'Floria', 'Jenni', 'Suzy', 'Alexia', 'Violet', 'Merle', 'Louis', 'Frederica', 'Ron', 'Terri', 'Marcos', 'Burl', 'Regena', 'Candra', 'Zelda', 'Shawna', 'Kelsie', 'Daniella', 'Gia', 'Theo', 'Laurine', 'Kali', 'Cecil', 'Ozie', 'Lindsey', 'Theda', 'Christina', 'Evan', 'Dinah', 'Robt', 'Houston', 'Theodore', 'Amparo', 'Arturo', 'Maria', 'Fredricka', 'Shirl', 'Man', 'Felicia', 'Jonelle', 'Jodi', 'Lacresha', 'Nelle', 'Nickie', 'Nilsa', 'Annemarie', 'Johnsie', 'Milissa', 'Anastasia', 'Ned', 'Tomiko', 'Ressie', 'Brandee', 'Carisa', 'Wanetta', 'Nadene', 'Garland', 'Cortez', 'Saul', 'Winford', 'Erica', 'Irwin', 'Levi', 'Sam', 'Carina', 'Lillian', 'Milford', 'Augustus', 'Jamaal', 'Birgit', 'Chaya', 'Moira', 'Beckie', 'Lue', 'My', 'Jasmine', 'Nettie', 'Marylynn', 'Dian', 'Clarine', 'Micheline', 'Rodrigo', 'Karrie', 'Savanna', 'Natashia', 'Shawnee', 'Enda', 'Melody', 'Lakesha', 'Daniela', 'Kanesha', 'Madaline', 'Ardelle', 'Quinton', 'Jacqulyn', 'Peg', 'Maynard', 'Nikia', 'Delicia', 'Samuel', 'Thurman', 'Talitha', 'Anneliese', 'Tracie', 'Janel', 'Halley', 'Candance', 'Minh', 'Neville', 'Rosenda', 'Isidra', 'Judie', 'Wanda', 'Charity', 'Bong', 'Georgianne', 'Terry', 'Leisa', 'Dillon', 'Jamika', 'Shaniqua', 'Gerard', 'Lelah', 'Ceola', 'Willetta', 'Colene', 'Royce', 'Chas', 'Abigail', 'Felicidad', 'Livia', 'Sharice', 'Daisy', 'Ulrike', 'Maren', 'Trina', 'Daphne', 'Nola', 'Gabriele', 'Lauralee', 'Hana', 'Sandy', 'Margy', 'Peggy', 'Shanon', 'Verlene', 'Joann', 'Concetta', 'Cornelius', 'Maybell', 'Colby', 'Jule', 'Kendra', 'Emely', 'Dorathy', 'Cindie', 'Jacelyn', 'Regenia', 'Vasiliki', 'Tenisha', 'Ronald', 'Cleveland', 'Tommie', 'Jacquelin', 'Wilber', 'Leanne', 'Hedy', 'Andy', 'Jacquline', 'Judson', 'Kym', 'Emelia', 'Von', 'Chauncey', 'Lawanda', 'Dewitt', 'Neely', 'Shonna', 'Wilbert', 'Leona', 'Lianne', 'Carmen', 'Deb', 'Eveline', 'Sharie', 'Charline', 'Jere', 'Odessa', 'Minna', 'Paz', 'Kathryne', 'Harley', 'Lucy', 'Davida', 'Neta', 'Hershel', 'Freida', 'Sana', 'Breann', 'Joycelyn', 'Amos', 'Rosa', 'Kala', 'Neoma', 'Lynelle', 'Darleen', 'Kecia', 'Kandy', 'Amada', 'Aja', 'Jacques', 'Eldridge', 'Beryl', 'Lou', 'Kay', 'Yu', 'Awilda', 'Helen', 'Hung', 'Bertram', 'Keitha', 'Claud', 'Tambra', 'Marilou', 'Caren', 'Domitila', 'Eusebia', 'Yelena', 'Hoa', 'Loree', 'Adeline', 'Therese', 'Eugene', 'Chung', 'Oretha', 'Vikki', 'Ilona', 'Abraham', 'Marquita', 'Wynell', 'Dewey', 'Carter', 'Yuette', 'Tari', 'Nana', 'Deloris', 'Robby', 'Bao', 'Marisha', 'Dirk', 'Francis', 'Candice', 'Linwood', 'Sona', 'Leopoldo', 'Corrie', 'Eulalia', 'Stella', 'Venus', 'Gita', 'Rebecca', 'Shakia', 'Brenda', 'Wes', 'Clyde', 'Maryanna', 'Lavenia', 'Enoch', 'Lavonna', 'Ahmed', 'Earlean', 'Caterina', 'Chuck', 'Deeann', 'Minda', 'Daina', 'Lillie', 'Carletta', 'Albert', 'Arlen', 'Porsche', 'Erich', 'Ettie', 'Denita', 'Noelia', 'Melani', 'Debbra', 'Jade', 'Osvaldo', 'Lizbeth', 'Ayana', 'Eartha', 'Zofia', 'Paulina', 'Jackeline', 'Edgardo', 'Pattie', 'Billye', 'Carlie', 'Josue', 'Cordell', 'Aldo', 'Terra', 'Hertha', 'Lovella', 'Charissa', 'Kristeen', 'Lilian', 'Orville', 'Clarinda', 'Cassey', 'Myrle', 'Katlyn', 'Danica', 'Liana', 'Angele', 'August', 'Alverta', 'Kitty', 'Ezra', 'Briana', 'Mckinley', 'Raina', 'Maryland', 'Lizzette', 'Selene', 'Merna', 'Duane', 'Shayna', 'Adriana', 'Virgen', 'Brandi', 'Jacquiline', 'Kaylee', 'Willodean', 'Taina', 'Johnetta', 'Georgie', 'Foster', 'Heather', 'Tegan', 'Benedict', 'Sherron', 'Hope', 'Wendy', 'Jeanette', 'Elvira', 'Leandra', 'Jonah', 'Gwenda', 'Milan', 'Mariel', 'Shelli', 'Donna', 'Pearly', 'Eliana', 'Maddie', 'Carolina', 'Elin', 'Ingeborg', 'Katherine', 'Meryl', 'Jackqueline', 'Nickolas', 'Josephina', 'Scot', 'Lakeesha', 'Krysten', 'Amee', 'Yolando', 'Sanora', 'Ursula', 'Fermin', 'Yung', 'Vivien', 'Reta', 'Ciara', 'Merrie', 'Pamila', 'Venita', 'Tiesha', 'Kathe', 'Tyesha', 'Denise', 'Gisele', 'Maurita', 'Kathrine', 'Prince', 'Selina', 'Joan', 'Sook', 'Vania', 'Margit', 'Rebeca', 'Ginger', 'Delmer', 'Sol', 'Morris', 'Guillermina', 'Joaquin', 'Svetlana', 'Nora', 'Dean', 'Dixie', 'Kirstin', 'Abe', 'Glinda', 'Jannie', 'Gilberto', 'Tiana', 'Emil', 'Shiloh', 'Taneka', 'Rodrick', 'Nolan', 'Leonor', 'Tonya', 'Karla', 'Hiram', 'Ludivina', 'Berna', 'Emory', 'Loreta', 'Alona', 'Maricruz', 'Dee', 'Leanora', 'Christel', 'Bill', 'Robert', 'Vanesa', 'Amberly', 'Samella', 'Myra', 'Nguyet', 'Felipa', 'Jaymie', 'Chet', 'Lyda', 'Cathie', 'Bok', 'Elisabeth', 'Tifany', 'Santa', 'Dorothea', 'Andree', 'Douglas', 'Maryrose', 'Sparkle', 'Abel', 'Cherise', 'Keesha', 'Oswaldo', 'Dani', 'Christena', 'Stacey', 'Verdell', 'Antwan', 'Gabriela', 'Marvin', 'Herman', 'Paris', 'Dede', 'Benny', 'Clement', 'Julian', 'Willette', 'Garret', 'Magan', 'Kathline', 'Lorretta', 'Freeda', 'Donny', 'Jacqui', 'Socorro', 'Lindsy', 'Madeleine', 'Milagro', 'Alba', 'Jenine', 'Chia', 'Nancie', 'Ira', 'Retha', 'Coralie', 'Coletta', 'Gilda', 'Doretha', 'Taryn', 'Monnie', 'Saundra', 'Jennie', 'Winter', 'Elsa', 'Burma', 'Cedric', 'Maple', 'Shirleen', 'Ruthe', 'Jonna', 'Lonnie', 'Hiroko', 'Kasie', 'Verdie', 'Soledad', 'Latrina', 'Penelope', 'Lois', 'Renaldo', 'Christine', 'Stacia', 'Mikaela', 'Marivel', 'Rheba', 'Agnes', 'Thanh', 'Carlton', 'Alesia', 'Trudi', 'Evon', 'Criselda', 'Tory', 'Elna', 'Sima', 'Roseann', 'Lovie', 'Donette', 'Rosaline', 'Temeka', 'Vicenta', 'Sang', 'Janice', 'Kiera', 'Una', 'Marta', 'Oren', 'Delana', 'Louann', 'Anjanette', 'Filomena', 'Audry', 'Mitzie', 'Lucienne', 'Cammie', 'Jennine', 'Ngoc', 'Harlan', 'Na', 'Teodoro', 'Ofelia', 'Kerrie', 'Kimberlee', 'Mireille', 'Evette', 'William', 'Lucien', 'Randall', 'Ninfa', 'Ferdinand', 'Connie', 'Elana', 'Rudy', 'Kaylene', 'Arcelia', 'Ricky', 'Norene', 'Deanna', 'Laurinda', 'Cassandra', 'Merrilee', 'Katelynn', 'Keri', 'Madonna', 'Edra', 'Zenaida', 'Marna', 'Lindy', 'Berneice', 'Emerald', 'Jillian', 'Odette', 'Margrett', 'Trish', 'Raguel', 'Bonnie', 'Cami', 'Sheryll', 'Rogelio', 'Ivonne', 'Marisa', 'Corine', 'Brendan', 'Lakeshia', 'Adalberto', 'Nerissa', 'Henrietta', 'Franklin', 'Serena', 'Wendi', 'Marilynn', 'Magali', 'Brooke', 'Lesha', 'Willena', 'Jenae', 'Shante', 'Marcell', 'Annie', 'Cherri', 'Petra', 'Milton', 'Brandy', 'Tuyet', 'Gavin', 'Russel', 'Dannie', 'Bernadine', 'Thomasena', 'Bonita', 'Shanelle', 'Misha', 'Armanda', 'Delpha', 'Joye', 'Claudia', 'Mee', 'Julius', 'Shona', 'Lawanna', 'Eva', 'Jonathan', 'Perla', 'Arianne', 'Kia', 'Ashlie', 'Thuy', 'Sherlene', 'Jeramy', 'Cythia', 'Richard', 'Arlie', 'Piper', 'Tarra', 'Edwin', 'Kieth', 'Delsie', 'Shirlee', 'Isabelle', 'Adrianne', 'Reita', 'Clementina', 'Holli', 'Amelia', 'Fausto', 'Darcel', 'Wally', 'Hallie', 'Stewart', 'Veronika', 'Clotilde', 'Emilia', 'Elba', 'Wilhemina', 'Jerold', 'Gilbert', 'Sonja', 'Joanne', 'Tama', 'Inell', 'Lupe', 'Erline', 'Darron', 'Honey', 'Scott', 'Raymon', 'Darline', 'Wayne', 'Lizabeth', 'Desire', 'Felipe', 'Izetta', 'Miranda', 'Bruna', 'Shiela', 'Louella', 'Titus', 'Myles', 'Rey', 'Ethelyn', 'Luis', 'Leia', 'Lory', 'Marietta', 'Rose', 'Benton', 'Dulcie', 'Ute', 'Kylie', 'Earline', 'Frederic', 'Beverly', 'Andrea', 'Marline', 'Gabriel', 'Sandee'],
    markup = '<html>\
                <body>\
                    <form method="POST">\
                        Give me <input type="number" name="number_of_users" placeholder="100" style="width:80px"> users\
                        with <input type="number" name="number_of_activities" placeholder="100" style="width:80px"> activities\
                        starting from <input type="text" name="start_date" placeholder="2010-01-01" style="width:100px">\
                        <input type="submit" value="Go!">\
                    </form>\
                    <form method="POST">\
                        Create default users\
                        <input type="submit" name="create_default_users" value="Go!">\
                    </form>\
                    <form method="POST">\
                        <span style="color:red;">Delete</span> all users\
                        <input type="submit" name="delete_all_users" value="Go!" style="color:#fff; background-color:red; border:none; border-radius: 5px; padding: 3px 4px;">\
                    </form>\
                </body>\
            </html>';

exports.get = function(req, res) {
    res.send(markup);
};

exports.post = function(req, res) {
    if (typeof req.body.number_of_users !== 'undefined' && typeof req.body.number_of_activities && typeof req.body.start_date) {
        var users_count = req.body.number_of_users;
        for(var i=0 ; i<users_count ; i++) {
            create_user(req.body.number_of_activities, req.body.start_date);
        }
        res.send(markup);
    } else if (typeof req.body.delete_all_users !== 'undefined') {
        User.collection.remove(function() {
            Profile.collection.remove(function() {
                Activity.collection.remove(function() {
                    res.send(markup);
                });
            });
        });
    } else if (typeof req.body.create_default_users !== 'undefined') {
        create_default_users();
        res.send(markup);
    }
};

function create_user(activities_count, start_date, res) {
    (function() {
        var random_index = ~~(Math.random() * names.length);
        var firstName = names[random_index];

        var random_index = ~~(Math.random() * names.length);
        var lastName = names[random_index];

        var delimiter = ~~(Math.random() * 2) ? '.' : '_';

        var new_user = {
            'email': firstName.toLowerCase() + delimiter + lastName.toLowerCase() + (~~(Math.random() * 10000)) + '@trafie.com',
            'password': userHelper.encryptPassword('123123'),
            'valid': true
        };

        var disciplines = ['100m','200m','400m','800m','1500m','3000m','60m_hurdles','100m_hurdles','110m_hurdles','400m_hurdles','3000m_steeple','4x100m_relay','4x400m_relay','marathon','high_jump','long_jump','triple_jump','pole_vault','shot_put','discus','hammer','javelin','pentathlon','heptathlon','decathlon'];
        var users_disciplines = [];
        var main_discipline = disciplines.splice(~~(Math.random() * disciplines.length), 1)[0];
        // 40% chance to have one discipline, 40% to have two and 20% to have three
        if(~~(Math.random() * 5) > 1) {
            var selected_discipline = disciplines.splice(~~(Math.random() * disciplines.length), 1)[0];
            users_disciplines.push(selected_discipline);
            if(!(~~(Math.random() * 3))){
                selected_discipline = disciplines.splice(~~(Math.random() * disciplines.length), 1)[0];
                users_disciplines.push(selected_discipline);
            }
        }

        var new_profile = {
            'firstName': firstName,
            'lastName': lastName,
            'username': firstName.toLowerCase() + delimiter + lastName.toLowerCase() + (~~(Math.random() * 10000)),
            'discipline': main_discipline
        };

        if (~~(Math.random() * 2)) {
            var random_index = ~~(Math.random() * names.length);
            var middle_name = names[random_index];
            new_profile.lastName = middle_name + ' ' + lastName;
        }

        var activities = [];

        for(var i=0 ; i<activities_count ; i++) {
            var activity = {};

            if(users_disciplines.length) {
                activity.discipline = ~~(Math.random() * 4) < 3 ? main_discipline : users_disciplines[~~(Math.random() * users_disciplines.length)];
            } else {
                activity.discipline = main_discipline;
            }

            activity.performance = random_performance(activity.discipline).toString();

            var start_timestamp = + moment(start_date).format('X');
            var now = + moment().format('X');
            var activity_timestamp = start_timestamp + ~~(Math.random() * (now - start_timestamp));
            var activity_date = moment.unix(activity_timestamp);
            activity.date = activity_date.toDate();

            activity.rank = ~~(Math.random() * 12) + 1;

            var cities = ['Chania','Halkida','Athens','Moscow','London','Berlin','Madrid','Paris','Stockholm','Vienna','Lisbon','Copenhagen','Helsinki','Rome','Oslo'];

            activity.location =  cities[~~(Math.random()*(cities.length-1))];

            var competitions = ['Panuniversal Games','Olympic Games','Kookoonaria','Trafie Indoors','Trafie Outdoors','Trafie Warm-up Championship', 'European Championship', 'Trafie Elite'];
            activity.competition = competitions[~~(Math.random()*(competitions.length-1))] + ' ' + activity.date.getFullYear();
            activity.notes = '';
            activity.private = false;
            activities.push(activity);
        }

        // Creating the user and profile objects
        var user = new User(new_user);

        // Saving the user and the profile data
        user.save(function(err, user) {
            new_profile._id = user._id;
            var profile = new Profile(new_profile);
            Profile.schema.save(profile)
            .then(function() {
                if(activities_count) {
                    (function(){
                        for(var i=0 ; i<activities_count ; i++) {
                            activities[i].userId = user._id;
                            var activity = new Activity(activities[i]);
                            activity.save(function(err, activity) {
                                if(err) {
                                    console.log(err);
                                }
                            });
                        }
                    })();
                }
            });
        });
    })();
}

function random_performance(discipline) {
    switch (discipline) {
        case '100m':
            var seconds = ('0' + (9 + ~~(Math.random() * 2))).slice(-2);
            var centiseconds = ('0' + (~~(Math.random() * 100))).slice(-2);
            return '00:00:' + seconds + '.' + centiseconds;
        case '200m':
            var seconds = (19 + ~~(Math.random() * 3));
            var centiseconds = ('0' + (~~(Math.random() * 100))).slice(-2);
            return '00:00:' + seconds + '.' + centiseconds;
        case '400m':
            var seconds = (43 + ~~(Math.random() * 4));
            var centiseconds = ('0' + (~~(Math.random() * 100))).slice(-2);
            return '00:00:' + seconds + '.' + centiseconds;
        case '800m':
            var seconds = (53 + ~~(Math.random() * 5));
            var centiseconds = ('0' + (~~(Math.random() * 100))).slice(-2);
            return '00:01:' + seconds + '.' + centiseconds;
        case '1500m':
            var seconds = (26 + ~~(Math.random() * 7));
            var centiseconds = ('0' + (~~(Math.random() * 100))).slice(-2);
            return '00:03:' + seconds + '.' + centiseconds;
        case '3000m':
            var seconds = (30 + ~~(Math.random() * 10));
            var centiseconds = ('0' + (~~(Math.random() * 100))).slice(-2);
            return '00:07:' + seconds + '.' + centiseconds;
        case '60m_hurdles':
            var seconds = ('0' + (7 + ~~(Math.random() * 2))).slice(-2);
            var centiseconds = ('0' + (~~(Math.random() * 100))).slice(-2);
            return '00:00:' + seconds + '.' + centiseconds;
        case '100m_hurdles':
            var seconds = ('0' + (12 + ~~(Math.random() * 3))).slice(-2);
            var centiseconds = ('0' + (~~(Math.random() * 100))).slice(-2);
            return '00:00:' + seconds + '.' + centiseconds;
        case '110m_hurdles':
            var seconds = ('0' + (12 + ~~(Math.random() * 3))).slice(-2);
            var centiseconds = ('0' + (~~(Math.random() * 100))).slice(-2);
            return '00:00:' + seconds + '.' + centiseconds;
        case '400m_hurdles':
            var seconds = (43 + ~~(Math.random() * 4));
            var centiseconds = ('0' + (~~(Math.random() * 100))).slice(-2);
            return '00:00:' + seconds + '.' + centiseconds;
        case '3000m_steeple':
            var seconds = (30 + ~~(Math.random() * 10));
            var centiseconds = ('0' + (~~(Math.random() * 100))).slice(-2);
            return '00:07:' + seconds + '.' + centiseconds;
        case '4x100m_relay':
            var seconds = (38 + ~~(Math.random() * 8));
            var centiseconds = ('0' + (~~(Math.random() * 100))).slice(-2);
            return '00:00:' + seconds + '.' + centiseconds;
        case '4x400m_relay':
            var seconds = (53 + ~~(Math.random() * 7));
            var centiseconds = ('0' + (~~(Math.random() * 100))).slice(-2);
            return '00:02:' + seconds + '.' + centiseconds;
        case 'marathon':
            var minutes = ('0' + (~~(Math.random() * 40))).slice(-2);
            var seconds = (53 + ~~(Math.random() * 7));
            var centiseconds = ('0' + (~~(Math.random() * 100))).slice(-2);
            return '02:' + minutes + ':' + seconds + '.' + centiseconds;
        case 'high_jump':
            return 20000 + ~~(Math.random() * 50) * 100;
        case 'long_jump':
            return 80000 + ~~(Math.random() * 100) * 100;
        case 'triple_jump':
            return 170000 + ~~(Math.random() * 200) * 100;
        case 'pole_vault':
            return 55000 + ~~(Math.random() * 100) * 100;
        case 'shot_put':
            return 200000 + ~~(Math.random() * 400) * 100;
        case 'discus':
            return 690000 + ~~(Math.random() * 500) * 100;
        case 'hammer':
            return 800000 + ~~(Math.random() * 600) * 100;
        case 'javelin':
            return 920000 + ~~(Math.random() * 600) * 100;
        case 'pentathlon':
            return 6000 + ~~(Math.random() * 500);
        case 'heptathlon':
            return 8000 + ~~(Math.random() * 500);
        case 'decathlon':
            return 12000 + ~~(Math.random() * 1000);
    }
}

function create_default_users() {
    var default_users = [
        {
            user: {
                'email': 'user@trafie.com',
                'password': userHelper.encryptPassword('123123'),
                'valid': true
            },
            profile: {
                'firstName': 'Testodore',
                'lastName': 'Testoyevsky',
                'username': 'user'
            }
        },
        {
            user: {
                'email': 'theodore@trafie.com',
                'password': userHelper.encryptPassword('123123'),
                'valid': true
            },
            profile: {
                'firstName': 'Theodore',
                'lastName': 'Mathioudakis',
                'username': 'theodore'
            }
        },
        {
            user: {
                'email': 'george@trafie.com',
                'password': userHelper.encryptPassword('123123'),
                'valid': true
            },
            profile: {
                'firstName': 'George',
                'lastName': 'Balasis',
                'username': 'george'
            }
        },
        {
            user: {
                'email': 'babis@trafie.com',
                'password': userHelper.encryptPassword('123123'),
                'valid': true
            },
            profile: {
                'firstName': 'Babis',
                'lastName': 'Mathioudakis',
                'username': 'babis'
            }
        },
        {
            user: {
                'email': 'elisavet@trafie.com',
                'password': userHelper.encryptPassword('123123'),
                'valid': true
            },
            profile: {
                'firstName': 'Elisavet',
                'lastName': 'Balasi',
                'username': 'elisavet'
            }
        }
    ];

    var users_length = default_users.length;
    for(var i=0 ; i<users_length ; i++) {
        (function(){
            var u = default_users[i];
            User.schema.findOne({'email':u.user.email}, '_id')
            .then(function(user) {
                if(!user) {
                    // Creating the user and profile objects
                    var user = new User(u.user);

                    // Saving the user and the profile data
                    user.save(function(err, user) {
                        u.profile._id = user._id;
                        var profile = new Profile(u.profile);
                        Profile.schema.save(profile);
                    });
                }
            });
        })();
    }
}