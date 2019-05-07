export const defaultProfilePic = "/images/ui/profile_pic.svg";
export const disciplines = ["60m","100m","200m","400m","800m","1500m","3000m","5000m","10000m","60m_hurdles","100m_hurdles","110m_hurdles","400m_hurdles","3000m_steeplechase","4x100m_relay","4x400m_relay","half_marathon","marathon","20km_race_walk","50km_race_walk","cross_country_running","high_jump","long_jump","triple_jump","pole_vault","shot_put","discus","hammer","javelin","pentathlon","heptathlon","decathlon"];
export const disciplineCategories = {
    time: ["60m","100m","200m","400m","800m","1500m","3000m","5000m","10000m","60m_hurdles","100m_hurdles","110m_hurdles","400m_hurdles","3000m_steeplechase","4x100m_relay","4x400m_relay","half_marathon","marathon","20km_race_walk","50km_race_walk","cross_country_running"],
    distance: ["high_jump","long_jump","triple_jump","pole_vault","shot_put","discus","hammer","javelin"],
    points: ["pentathlon", "heptathlon", "decathlon"]
};
export const countries = ["af","ax","al","dz","as","ad","ao","ai","aq","ag","ar","am","aw","au","at","az","bs","bh","bd","bb","by","be","bz","bj","bm","bt","bo","bq","ba","bw","bv","br","io","bn","bg","bf","bi","kh","cm","ca","cv","ky","cf","td","cl","cn","cx","cc","co","km","cg","cd","ck","cr","ci","hr","cu","cw","cy","cz","dk","dj","dm","do","ec","eg","sv","gq","er","ee","et","fk","fo","fj","fi","fr","gf","pf","tf","ga","gm","ge","de","gh","gi","gr","gl","gd","gp","gu","gt","gg","gn","gw","gy","ht","hm","va","hn","hk","hu","is","in","id","ir","iq","ie","im","il","it","jm","jp","je","jo","kz","ke","ki","kp","kr","kw","kg","la","lv","lb","ls","lr","ly","li","lt","lu","mo","mk","mg","mw","my","mv","ml","mt","mh","mq","mr","mu","yt","mx","fm","md","mc","mn","me","ms","ma","mz","mm","na","nr","np","nl","nc","nz","ni","ne","ng","nu","nf","mp","no","om","pk","pw","ps","pa","pg","py","pe","ph","pn","pl","pt","pr","qa","re","ro","ru","rw","bl","sh","kn","lc","mf","pm","vc","ws","sm","st","sa","sn","rs","sc","sl","sg","sx","sk","si","sb","so","za","gs","ss","es","lk","sd","sr","sj","sz","se","ch","sy","tw","tj","tz","th","tl","tg","tk","to","tt","tn","tr","tm","tc","tv","ug","ua","ae","gb","us","um","uy","uz","vu","ve","vn","vg","vi","wf","eh","ye","zm","zw"];
export const languages = ["en", "el"];
export const dateFormats = ["D-M-YYYY", "M-D-YYYY"];
export const defaultPicture = "/images/profile/default-picture.jpeg";
export const usernameRegex = /^[[A-Za-z_0-9]{1,20}\.?[A-Za-z_0-9]{1,20}]{0,20}$/;
export const forbiddenUsernames = ["trafie","trafie.com","app","bower_components","fonts","images","languages","styles","assets","public","user","users","api","apiV2","api-v2","api2","apiV3","api-v3","api3","register","login","authorize","validate-email","validate","resend-validation-email","reset-password-request","reset-password","logout","deactivate-account","deactivate","settings","terms-of-service","tos","about","privacy","legal","news","blog","page","contact","feedback","admin","administrator","help","delete","remove","db", "404", "diaxeirisi"];
export const nameRegex = /^[A-Za-z\- ]{2,35}$/;
export const birthdayValidation = {
    format: "YYYY-MM-DD",
    regex: /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/
};
export const aboutRegex = /^.{0,400}$/;
export const dateFormatRegex = /^(D-M-YYYY|M-D-YYYY)$/;
export const passwordRegex = /^.{6,}$/;
export const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,})?$/;
export const roleRegex = /^(athlete|coach)$/;
export const unitsRegex = /^(meters|feet)$/;
export const notesRegex = /[\d\D]{0,1000}/;
export const commentsRegex = /^.{0,1000}$/;
export const locationRegex = /^.{0,100}$/;
export const competitionRankRegex = /^\d+$/;
export const competitionNameRegex = /^.{2,100}$/;
export const trainingKeyRegex = /^.{1,64}$/;
export const trainingValueRegex = /[\d\D]{1,200}/;
export const performanceValidation = {
    timeMaxValue: 8640000,
    distanceMaxValue: 12000000,
    pointsMaxValue: 10000
};