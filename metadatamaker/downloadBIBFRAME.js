/*
* Author output depends on how the name was entered
*/
function fillAuthorBIBFRAME(family,given,role,authorCount) {
	var role_index = { 'art': 'artist', 'aut': 'author', 'ctb': 'contributor', 'edt': 'editor', 'ill': 'illustrator', 'trl': 'translator'};
	if (checkExists(given) || checkExists(family)) {


		var contributionText =
		'        <bf:contribution>\n' +
		'            <bf:Contribution>\n';

		if (authorCount == 0){
			contributionText += '                <rdf:type rdf:resource="http://id.loc.gov/ontologies/bflc/PrimaryContribution"/>\n'
		}

		contributionText +=
		'                <bf:role>\n' +
		'                    <bf:Role rdf:about="http://id.loc.gov/vocabulary/relators/' + role + '"/>\n' +
		'                </bf:role>\n' +
		'                <bf:agent>\n' +
		'                    <bf:Agent>\n' +
		'                        <rdf:type rdf:resource="http://id.loc.gov/ontologies/bibframe/Person"/>\n' +
		'						<rdfs:label>';


		if (checkExists(family)) {
			contributionText += escapeXML(family);
		}

		if (checkExists(given) && checkExists(family)) {
			contributionText += ', ';
		}

		if (checkExists(given)) {
			contributionText += escapeXML(given);
		}

		contributionText +=
		'</rdfs:label>\n' +
		'                    </bf:Agent>\n' +
		'                </bf:agent>\n' +
		'            </bf:Contribution>\n' +
		'        </bf:contribution>\n';

		return contributionText;
	}
	else {
		return '';
	}
}
function fillCorporateAuthorBIBFRAME(family,given,role,authorCount) {
	var role_index = { 'cre': 'creator', 'ctb': 'contributor',};
	if (checkExists(given) || checkExists(family)) {
		

		var contributionText =
		'        <bf:contribution>\n' +
		'            <bf:Contribution>\n' +

		contributionText +=
		'                <bf:agent>\n' +
		'                    <bf:Agent>\n' +
		'                        <rdf:type rdf:resource="http://id.loc.gov/ontologies/bibframe/Organization"/>\n' +
		'						<rdfs:label>';


		if (checkExists(family)) {
			contributionText += escapeXML(family);
		}

		if (checkExists(given) && checkExists(family)) {
			contributionText += ', ';
		}

		if (checkExists(given)) {
			contributionText += escapeXML(given);
		}

		contributionText +=
		'</rdfs:label>\n' +
		'                    </bf:Agent>\n' +
		'                </bf:agent>\n' +
		'                <bf:role>\n' +
		'                    <bf:Role rdf:about="http://id.loc.gov/vocabulary/relators/' + role + '"/>\n' +
		'                </bf:role>\n' +
		'            </bf:Contribution>\n' +
		'        </bf:contribution>\n';

		return contributionText;
	}
	else {
		return '';
	}
}

function sliceFastURI(fastURI){
	var charCheck = fastURI.charAt(0);
	if (charCheck == '1' || charCheck == '2' || charCheck == '3' || charCheck == '4' || charCheck == '5' || charCheck == '6' || charCheck == '7' || charCheck == '8' || charCheck == '9'){
		return fastURI;
	}

	return sliceFastURI(fastURI.slice(1,fastURI.length));
}

/*
 * Build a BIBFRAME record. Each DOM object is saved as a string, then all the strings are combined into one master text
 *
 * record: 			 object containing the user-input data
 * institution_info: object containing name of institution creating record
 */
 function downloadBIBFRAME(record,institution_info) {
 	var literatureTypes = {
 		'0': 'Not fiction (not further specified)',
 		'1': 'Fiction (not further specified)',
 		'd': 'Dramas',
 		'e': 'Essays',
 		'f': 'Novels',
 		'h': 'Humor, satires, etc.',
 		'i': 'Letters',
 		'j': 'Short stories',
 		'm': 'Mixed forms',
 		'p': 'Poetry',
 		's': 'Speeches',
 		'u': 'Unknown',
 		'|': 'No attempt to code'
 	}

 	var fastTypes = {
 		'00': 'name type="personal"',
 		'10': 'name type="corporate"',
 		'11': 'name type="conference"',
 		'30': 'titleInfo',
 		'50': 'topic',
 		'51': 'geographic',
 		'55': 'genre'
 	}

 	var startText =
 	'<?xml version="1.0" encoding="UTF-8"?>\n' +
 	'<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"\n' +
 	'    xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"\n' +
 	'    xmlns:bf="http://id.loc.gov/ontologies/bibframe/"\n' +
 	'    xmlns:bflc="http://id.loc.gov/ontologies/bflc/"\n' +
 	'    xmlns:madsrdf="http://www.loc.gov/mads/rdf/v1#">\n';

 	var adminText =
 	'    <bf:AdminMetadata>\n' +
 	'        <bflc:encodingLevel>\n' +
 	'            <bflc:EncodingLevel rdf:about="http://id.loc.gov/vocabulary/menclvl/7"/>\n' +
 	'        </bflc:encodingLevel>\n' +
 	'        <bf:assigner>\n' +
 	'            <bf:Agent rdf:about="' + escapeXML(institution_info['html']['url']) + '"/>' +
 	'        </bf:assigner>\n' +
 	'        <bf:descriptionLanguage>\n' +
 	'            <bf:Language rdf:about="http://id.loc.gov/vocabulary/languages/eng"/>\n' +
 	'        </bf:descriptionLanguage>\n' +
 	'        <bf:descriptionConventions>\n' +
 	'            <bf:DescriptionConventions rdf:about="http://id.loc.gov/vocabulary/descriptionConventions/rda"/>\n' +
 	'        </bf:descriptionConventions>\n' +
 	'        <bf:generationProcess>\n' +
 	'            <bf:GenerationProcess>\n' +
 	'                <rdfs:label>Metadata Maker v1.1, BIBFRAME 2.0 RDFXML; ';

 	var today = new Date();
 	var date = {
 		yyyy: today.getFullYear(),
 		mm: today.getMonth()+1,
 		dd: today.getDate(),
 		hh: today.getHours(),
 		minutes: today.getMinutes(),
 		ss: today.getSeconds()
 	};

 	adminText += date.yyyy + '-' + date.mm + '-' + date.dd + 'T' + date.hh + ':' + date.minutes + ':' + date.ss + '</rdfs:label>\n            </bf:GenerationProcess>\n        </bf:generationProcess>\n    </bf:AdminMetadata>\n';

 	var workText = '    <bf:Work rdf:about="http://example.org/d0e1#Work">\n';

 	var genreText = '';
 	if (checkExists(record.literature_yes) && checkExists(record.literature_dropdown)) {
 		genreText +=
 		'        <bf:genreForm>\n' +
 		'            <bf:GenreForm rdf:about="http://id.loc.gov/vocabulary/marcgt/map"/>\n' +
 		'        </bf:genreForm>\n';
 	}
 	workText += genreText;
 	
 	var authorText = '';
 	authorText += fillAuthorBIBFRAME(record.author[0]['family'],record.author[0]['given'],record.author[0]['role']);
 	if (checkExists(record.additional_authors)) {
 		for (var i = 0; i < record.additional_authors.length; i++) {
 			authorText += fillAuthorBIBFRAME(record.additional_authors[i][0]['family'],record.additional_authors[i][0]['given'],record.additional_authors[i][0]['role'],i);
 		}
 	}
 	workText += authorText;
 	if (checkExists(record.additional_corporate_authors)) {
 		for (var i = 0; i < record.additional_corporate_authors.length; i++) {
 			authorText += fillCorporateAuthorBIBFRAME(record.additional_corporate_authors[i][0]['corporate'],record.additional_corporate_authors[i][0]['role'],i);
 		}
 	}
 	workText += authorText;

 	var titleText =
 	'        <bf:title>\n' +
 	'            <bf:Title>\n' +
 	'                <bf:mainTitle>' + escapeXML(record.title[0]['title']) + '</bf:mainTitle>\n';
 	if (checkExists(record.title[0]['subtitle'])) {
 		titleText += '                <bf:subtitle>' + escapeXML(record.title[0]['subtitle']) + '</bf:subtitle>\n';
 	}
 	titleText +=
 	'            </bf:Title>\n' +
 	'        </bf:title>\n';
 	workText += titleText;

 	var scaleText = '        <bf:scale>' + record.scale + '</bf:scale>\n';
 	workText += scaleText

 	var subjectText = '';
 	var subjectTopicText = '';
 	var subjectGeographicText = '';
 	var subjectPersonText = '';
 	if (checkExists(record.fast)) {
 		for (var c = 0; c < record.fast.length; c++) {
 			if (record.fast[c][1] == '50'){
	 			subjectTopicText +=
	 			'        <bf:subject>\n' +
	 			'            <bf:Topic rdf:about="http://id.worldcat.org/fast/' + sliceFastURI(escapeXML(record.fast[c][1])) + '">\n' +
	 			'                <rdf:type rdf:resource="http://www.loc.gov/mads/rdf/v1#Topic"/>\n' +
	 			'                <bf:source>\n' +
	 			'                    <bf:Source rdf:about="http://id.loc.gov/vocabulary/identifiers/fast"/>\n' +
	 			'                </bf:source>\n' +
	 			'            </bf:Topic>\n' +
	 			'        </bf:subject>\n';
 			}
 			else if (record.fast[c][1] == '51'){
	 			subjectGeographicText +=
	 			'        <bf:subject>\n' +
	 			'            <bf:Topic rdf:about="http://id.worldcat.org/fast/' + sliceFastURI(escapeXML(record.fast[c][1])) + '">\n' +
	 			'                <rdf:type rdf:resource="http://www.loc.gov/mads/rdf/v1#Topic"/>\n' +
	 			'                <bf:source>\n' +
	 			'                    <bf:Source rdf:about="http://id.loc.gov/vocabulary/identifiers/fast"/>\n' +
	 			'                </bf:source>\n' +
	 			'            </bf:Topic>\n' +
	 			'        </bf:subject>\n';
 			}
 			else {
	 			subjectPersonText +=
	 			'        <bf:subject>\n' +
	 			'            <bf:Topic rdf:about="http://id.worldcat.org/fast/' + sliceFastURI(escapeXML(record.fast[c][1])) + '">\n' +
	 			'                <rdf:type rdf:resource="http://www.loc.gov/mads/rdf/v1#Topic"/>\n' +
	 			'                <bf:source>\n' +
	 			'                    <bf:Source rdf:about="http://id.loc.gov/vocabulary/identifiers/fast"/>\n' +
	 			'                </bf:source>\n' +
	 			'            </bf:Topic>\n' +
	 			'        </bf:subject>\n';
 			}
 		}
 	}
 	workText += subjectText + subjectGeographicText + subjectPersonText;

 	workText +=
 	'        <bf:hasInstance rdf:resource="http://example.org/d0e1#Instance"/>\n' +
 	'    </bf:Work>\n';


 	var instanceText =
 	'    <bf:Instance rdf:about="http://example.org/d0e1#Instance">\n' +
 	'        <rdf:type rdf:resource="http://id.loc.gov/ontologies/bibframe/Text"/>\n';

 	var languageText =
 	'        <bf:language>\n' +
 	'            <bf:Language rdf:about="http://id.loc.gov/vocabulary/languages/' + record.language + '"/>\n' +
 	'        </bf:language>\n';
 	instanceText += languageText;

 	instanceText +=
 	'        <bf:issuance>\n' +
 	'            <bf:Issuance rdf:about="http://id.loc.gov/vocabulary/issuance/mono"/>\n' +
 	'        </bf:issuance>\n';

 	var provisionText ='';
 	if (checkExists(record.publication_country) || checkExists(record.publication_place) || checkExists(record.publisher) || checkExists(record.publication_year) || checkExists(record.copyright_year) || checkExists(record.edition)) {
 		provisionText +=
 		'        <bf:provisionActivity>\n' +
 		'            <bf:ProvisionActivity>\n' +
 		'                <rdf:type rdf:resource="http://id.loc.gov/ontologies/bibframe/Publication"/>\n';

 		if (checkExists(record.publication_year)) {
 			provisionText += '                <bf:date>' + record.publication_year + '</bf:date>\n';
 		}

 		if (checkExists(record.publication_country)) {
 			provisionText +=
 			'                <bf:place>\n' +
 			'                    <bf:Place rdf:about="http://id.loc.gov/vocabulary/countries/' + record.publication_country + '"/>\n' +
 			'                </bf:place>\n';
 		}

 		if (checkExists(record.publication_place)) {
 			provisionText +=
 			'                <bf:place>\n' +
 			'                    <bf:Place>\n' +
 			'            			<rdfs:label>' + escapeXML(record.publication_place) + '</rdfs:label>\n' +
 			'                    </bf:Place>\n' +
 			'                </bf:place>\n';
 		}

 		if (checkExists(record.publisher)) {
 			provisionText +=
 			'                <bf:agent>\n' +
 			'                    <bf:Agent>\n' +
 			'                        <rdfs:label>' + escapeXML(record.publisher) + '</rdfs:label>\n' +
 			'                    </bf:Agent>\n' +
 			'                </bf:agent>\n';
 		}

 		provisionText += '            </bf:ProvisionActivity>\n';
 	}

 	instanceText += provisionText;

 	if (checkExists(record.copyright_year)) {
 		instanceText +=
 		'        <bf:copyrightDate rdf:datatype="http://id.loc.gov/datatypes/edtf">' + record.copyright_year + '</bf:copyrightDate>\n';
 	}

 	if (checkExists(record.isbn)) {
 		instanceText +=
 		'        <bf:identifiedBy>\n' +
 		'            <bf:Isbn rdf:about="http://id.loc.gov/vocabulary/identifiers/isbn">\n' +
 		'                <rdf:value>' + record.isbn + '</rdf:value>\n' +
 		'            </bf:Isbn>\n' +
 		'        </bf:identifiedBy>\n';
 	}

 	instanceText +=
 	'        <bf:title>\n' +
 	'            <bf:Title>\n' +
 	'                <bf:mainTitle>' + escapeXML(record.title[0]['title']) + '</bf:mainTitle>\n';
 	if (checkExists(record.title[0]['subtitle'])) {
 		instanceText += '                <bf:subTitle>' + escapeXML(record.title[0]['subtitle']) + '</bf:subTitle>\n';
 	}
 	instanceText +=
 	'            </bf:Title>\n' +
 	'        </bf:title>\n';

 	if (checkExists(record.edition)) {
 		instanceText += '        <bf:editionStatement>' + escapeXML(record.edition) + '</bf:editionStatement>\n';
 	}

 	instanceText += '        <bf:extent>1 map</bf:extent>\n';

 	if (checkExists(record.color)) {
 		instanceText += '        <bf:colorContent>' + record.color + '</bf:colorContent>\n';
 	}

 	instanceText += '        <bf:dimensions>' + record.dimensions + ' cm</bf:dimensions>\n'

 	instanceText +=
 	'        <bf:media>\n' +
 	'            <bf:Media rdf:about="http://id.loc.gov/vocabulary/mediaTypes/n"/>\n' +
 	'        </bf:media>\n' +
 	'        <bf:content>\n' +
 	'            <bf:Content rdf:about="http://id.loc.gov/vocabulary/contentTypes/cri"/>\n' +
 	'        </bf:content>\n' +
 	'        <bf:carrier>\n' +
 	'            <bf:Carrier rdf:about="http://id.loc.gov/vocabulary/carriers/nb"/>\n' +
 	'        </bf:carrier>\n' +
 	'        <bf:instanceOf rdf:resource="http://example.org/d0e1#Work"/>\n' +
 	'    </bf:Instance>\n';

 	var endText = '</rdf:RDF>';

 	var text = startText + adminText + workText + instanceText + endText;
 	downloadFile(text,'bibframe');
 }