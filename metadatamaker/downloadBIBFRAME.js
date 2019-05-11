/*
 * Author output depends on how the name was entered
 */
 function fillAuthorBIBFRAME(family,given,role,authorCount) {
 	var role_index = { 'art': 'artist', 'aut': 'author', 'ctb': 'contributor', 'edt': 'editor', 'ill': 'illustrator', 'trl': 'translator'};
 	if (checkExists(given) || checkExists(family)) {
 		

 		var contributionText = '        <bf:contribution>\n            <bf:Contribution>\n';

 		if (authorCount == 0){
 			contributionText += '                <rdf:type rdf:resource="http://id.loc.gov/ontologies/bflc/PrimaryContribution"/>\n'
 		}

 		contributionText += '                <bf:role>\n                    <bf:Role rdf:about="http://id.loc.gov/vocabulary/relators/' + role + '"/>\n                </bf:role>\n                <bf:agent>\n                    <bf:Agent>\n                        <rdf:type rdf:resource="http://id.loc.gov/ontologies/bibframe/Person"/>\n						<rdfs:label>';


 		if (checkExists(family)) {
 			contributionText += escapeXML(family);
 		}

 		if (checkExists(given) && checkExists(family)) {
 			contributionText += ', ';
 		}

 		if (checkExists(given)) {
 			contributionText += escapeXML(given);
 		}

 		contributionText += '</rdfs:label>\n                    </bf:Agent>\n                </bf:agent>\n            </bf:Contribution>\n        </bf:contribution>\n';

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
 		'    xmlns:bflc="http://id.loc.gov/ontologies/bflc/"\n';

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
 	var date = new Date();
 	var timeStamp = {
 		yyyy: date.getFullYear(),
 		mm: date.getMonth()+1,
 		dd: date.getDate(),
 		hh: date.getHours(),
 		minutes: date.getMinutes(),
 		ss: date.getSeconds()
 	};
 	var timeStampString = timeStamp.yyyy + '-' + timeStamp.mm + '-' + timeStamp.dd + 'T' + timeStamp.hh + ':' + timeStamp.minutes + ':' + timeStamp.ss;
 	adminText +=
 		timeStampString + '</rdfs:label>\n' +
 		'            </bf:GenerationProcess>\n' +
 		'        </bf:generationProcess>\n' +
 		'    </bf:AdminMetadata>\n';

 	var workText = '    <bf:Work rdf:about="http://example.org/d0e1#Work">\n';

 	var rdfTypeText = '        <rdf:type rdf:resource="http://id.loc.gov/ontologies/bibframe/Text"/>\n';
 	workText += rdfTypeText;

 	var genreText = 
 		'        <bf:genreForm>\n' +
 		'            <bf:GenreForm rdf:about="http://id.loc.gov/vocabulary/marcgt/doc"/>\n' +
 		'        </bf:genreForm>\n';
 	if (checkExists(record.literature_yes) && checkExists(record.literature_dropdown)) {
 		genreText +=
 			'        <bf:GenreForm>\n' +
 			'            <rdfs:label>' + literatureTypes[record.literature_dropdown] + '<rdfs:label/>\n' +
 			'        </bf:GenreForm>\n';
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


	var subjectFASTText = '';
	if (checkExists(record.fast)) {
		for (var c = 0; c < record.fast.length; c++) {
			subjectFASTText +=
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
	workText += subjectFASTText;

	var subjectBISACText = '';
	if (checkExists(record.subject_list)){
		for (var c = 0; c < record.subject_list.length; c++) {
			subjectBISACText +=
				'        <bf:subject>\n' +
				'            <bf:Topic>\n' +
				'                <rdf:type rdf:resource="http://www.loc.gov/mads/rdf/v1#ComplexSubject"/>\n' +
				'                <madsrdf:componentList rdf:parseType="Collection">\n' +
				'                    <madsrdf:Topic>\n' +
				'                        <madsrdf:authoritativeLabel>' + record.subject_list[c]['level1'] + '</madsrdf:authoritativeLabel>\n' +
				'                    </madsrdf:Topic>\n';
			if (checkExists(record.subject_list[c]['level2'])) {
				subjectBISACText +=
					'                    <madsrdf:Topic>\n' +
					'                        <madsrdf:authoritativeLabel>' + record.subject_list[c]['level2'] + '</madsrdf:authoritativeLabel>\n' + 
					'                    </madsrdf:Topic>\n';
			}
			if (checkExists(record.subject_list[c]['level3'])) {
				subjectBISACText +=
					'                    <madsrdf:Topic>\n' +
					'                        <madsrdf:authoritativeLabel>' + record.subject_list[c]['level3'] + '</madsrdf:authoritativeLabel>\n' + 
					'                    </madsrdf:Topic>\n';
			}
			subjectBISACText +=
				'                <bf:identifiedBy>\n' + record.subject_list[c]['id_number'] + '</bf:identifiedBy>\n' +
				'                <bf:source>bisacsh</bf:source>\n' +
				'            </bf:Topic>\n' +
				'        </bf:subject>\n';
		}
	}
	workText += subjectBISACText;

	workText +=
		'        <bf:hasInstance rdf:resource="http://example.org/d0e1#Instance"/>\n' +
		'    </bf:Work>\n';

	var instanceText =
		'    <bf:Instance rdf:about="http://example.org/d0e1#Instance">\n' +
		'        <rdf:type rdf:resource="http://id.loc.gov/ontologies/bibframe/Text"/>\n' +
		'        <rdf:type rdf:resource="http://id.loc.gov/ontologies/bibframe/Electronic"/>\n' +
		'        <bf:issuance>\n' +
		'            <bf:Issuance rdf:about="http://id.loc.gov/vocabulary/issuance/mono"/>\n' +
		'        </bf:issuance>\n';

	if (checkExists(record.edition)) {
		instanceText +='        <bf:editionStatement>' + escapeXML(record.edition) + '</bf:editionStatement>\n';
	}

	var languageText =
		'        <bf:language>\n' +
		'            <bf:Language rdf:about="http://id.loc.gov/vocabulary/languages/' + record.language + '"/>\n' +
		'        </bf:language>\n';
	instanceText += languageText;

	if (checkExists(record.copyright_year)) {
		instanceText += '        <bf:copyrightDate rdf:datatype="http://id.loc.gov/datatypes/edtf">' + record.copyright_year + '</bf:copyrightDate>\n';
	}

	if (checkExists(record.illustrations_yes)) {
		instanceText +=
			'        <bf:illustrativeContent>\n' +
			'            <bf:Illustration rdf:about="http://id.loc.gov/vocabulary/millus/ill"/>\n' +
			'        </bf:illustrativeContent>\n';
	}

	instanceText +=
		'        <bf:colorContent>\n' +
		'            <bf:ColorContent rdf:about="http://id.loc.gov/vocabulary/mcolor/mul"/>\n' +
		'        </bf:colorContent>\n';

	if (checkExists(record.isbn)) {
		instanceText +=
			'        <bf:identifiedBy>\n' +
			'    	<bf:Isbn rdf:about="http://id.loc.gov/vocabulary/identifiers/isbn">\n' +
			'                <rdf:value>' + record.isbn + '</rdf:value>\n            </bf:Isbn>\n        </bf:identifiedBy>\n';
	}

	instanceText +=
		'        <bf:title>\n' +
		'            <bf:Title>\n' +
		'                <bf:mainTitle>' + escapeXML(record.title[0]['title']) + '</bf:mainTitle>\n';
	if (checkExists(record.title[0]['subtitle'])) {
		instanceText += '                <bf:subTitle>' + escapeXML(record.title[0]['subtitle']) + '</bf:subTitle>\n';
	}
	instanceText += '            </bf:Title>\n        </bf:title>\n';

	var provisionText ='';
	if (checkExists(record.publication_country) || checkExists(record.publication_place) || checkExists(record.publisher) || checkExists(record.publication_year) || checkExists(record.copyright_year) || checkExists(record.edition)) {
		provisionText += '        <bf:provisionActivity>\n            <bf:ProvisionActivity>\n                <rdf:type rdf:resource="http://id.loc.gov/ontologies/bibframe/Publication"/>\n';

		if (checkExists(record.publication_place)) {
			provisionText += '                <bf:place>\n                    <bf:Place>\n            			<rdfs:label>' + escapeXML(record.publication_place) + '</rdfs:label>\n                    </bf:Place>\n                </bf:place>\n';
		}

		if (checkExists(record.publication_country)) {
			provisionText += '                <bf:place>\n                    <bf:Place rdf:about="http://id.loc.gov/vocabulary/countries/' + record.publication_country + '"/>\n                </bf:place>\n';
		}

		if (checkExists(record.publisher)) {
			provisionText += '                <bf:agent>\n                    <bf:Agent>\n                        <rdfs:label>' + escapeXML(record.publisher) + '</rdfs:label>\n                    </bf:Agent>\n                </bf:agent>\n';
		}

		if (checkExists(record.publication_year)) {
			provisionText += '                <bf:date>' + record.publication_year + '</bf:date>\n';
		}

		provisionText += '            </bf:ProvisionActivity>\n';
	}

	instanceText += provisionText +
		'        <bf:media>\n' +
		'            <bf:Media rdf:about="http://id.loc.gov/vocabulary/mediaTypes/c"/>\n' +
		'        </bf:media>\n' +
		'        <bf:content>\n' +
		'            <bf:Content rdf:about="http://id.loc.gov/vocabulary/contentTypes/txt"/>\n' +
		'        </bf:content>\n' +
		'        <bf:carrier>\n' +
		'            <bf:Carrier rdf:about="http://id.loc.gov/vocabulary/carriers/cr"/>\n' +
		'        </bf:carrier>\n' +
		'        <bf:extent>1 online resource</bf:extent>\n' +
		'        <bf:hasItem rdf:resource="http://example.org/d0e1#Item856-22"/>\n' +
		'        <bf:instanceOf rdf:resource="http://example.org/d0e1#Work"/>\n' +
		'    </bf:Instance>\n';

	var itemText += 
		'    <bf:Item rdf:about="http://example.org/d0e1#Item856-22">\n' +
		'        <bf:electronicLocator>\n' +
		'            <rdfs:Resource>\n' +
		'                <bflc:locator rdf:resource="http://web.a.ebscohost.com/ehost/detail/detail?vid=0&amp;sid=c2f0c47f-7788-4de9-bc21-6f29ff443fbe%40sdc-v-sessmgr04&amp;bdata=#AN=658735&amp;db=nlebk"/>\n';
	
	if(checkExists(record.notes))
		itemText += '                <bf:note>' + record.notes + '</bf:note>\n';

	itemText +=
		'            </rdfs:Resource>\n' +
		'        </bf:electronicLocator>\n' +
		'        <bf:itemOf rdf:resource="http://example.org/d0e1#Instance"/>\n' +
		'    </bf:Item>\n'

	var endText = '</rdf:RDF>';

	var text = startText + adminText + workText + instanceText + itemText + endText;
	downloadFile(text,'bibframe');
}