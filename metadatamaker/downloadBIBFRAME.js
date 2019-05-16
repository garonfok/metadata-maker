/*
 * Build a BIBFRAME record. Each DOM object is saved as a string, then all the strings are combined into one master text
 *
 * record: 			 object containing the user-input data
 * institution_info: object containing name of institution creating record
 */
 function downloadBIBFRAME(record,institution_info) {
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

 	adminText +=
 		date.yyyy + '-' + date.mm + '-' + date.dd + 'T' + date.hh + ':' + date.minutes + ':' + date.ss + '</rdfs:label>\n' +
 		'            </bf:GenerationProcess>\n' +
 		'        </bf:generationProcess>\n' +
 		'    </bf:AdminMetadata>\n';

 	var workText = '    <bf:Work rdf:about="http://example.org/d0e1#Work">\n';

 	var titleText =
 		'        <bf:title>\n' +
 		'            <bf:Title>\n' +
 		'                <bf:mainTitle>' + escapeXML(record.title[0]['title']) + '</bf:mainTitle>\n' +
 		'            </bf:Title>\n' +
 		'        </bf:title>\n';
 	workText += titleText;

 	var authorText =
 		'        <bf:contribution>\n' +
 		'            <bf:Contribution>\n' +
 		'                <rdf:type rdf:resource="http://id.loc.gov/ontologies/bflc/PrimaryContribution"/>\n' +
 		'                <bf:agent>\n' +
 		'                    <bf:Agent>\n' +
 		'                        <rdf:type rdf:resource="http://id.loc.gov/ontologies/bibframe/Person"/>\n' +
 		'						<rdfs:label>' + record.author['family'] + ', ' + record.author['given'] + '</rdfs:label>\n' +
 		'                    </bf:Agent>\n' +
 		'                </bf:agent>\n' +
 		'            </bf:Contribution>\n' +
 		'        </bf:contribution>\n';
 	workText += authorText;

	var dissertationText =
		'        <bf:dissertation>\n' +
		'            <bf:Dissertation>\n' +
		'                <bf:degree>' + record.dissertation_type + '</bf:degree>\n' +
		'                <bf:grantingInstitution>\n' +
		'                    <bf:Agent rdf:about="http://id.loc.gov/authorities/names/n79049103"/>\n' +
		'                </bf:grantingInstitution>\n' +
		'                <bf:date>' + record.publication_year + '</bf:date>\n' +
		'            </bf:Dissertation>\n' +
		'        </bf:dissertation>\n';
	workText += dissertationText;

	var subjectText =
		'        <bf:subject>\n' +
		'            <bf:Topic>\n' +
		'                <rdf:type rdf:resource="http://www.loc.gov/mads/rdf/v1#Topic"/>\n' +
		'                <rdfs:label>' + record.major + '</rdfs:label>\n' +
		'            </bf:Topic>\n' +
		'        </bf:subject>\n';
	workText += subjectText;

	workText +=
		'        <bf:hasInstance rdf:resource="http://example.org/d0e1#Instance"/>\n' +
		'    </bf:Work>\n';


	var instanceText =
		'    <bf:Instance rdf:about="http://example.org/d0e1#Instance">\n' +
		'        <rdf:type rdf:resource="http://id.loc.gov/ontologies/bibframe/Manuscript"/>\n' +
		'        <rdf:type rdf:resource="http://id.loc.gov/ontologies/bibframe/Text"/>\n' +
		'        <bf:issuance>\n' +
		'            <bf:Issuance rdf:about="http://id.loc.gov/vocabulary/issuance/mono"/>\n' +
		'        </bf:issuance>\n';

	var languageText =
		'        <bf:language>\n' +
		'            <bf:Language rdf:about="http://id.loc.gov/vocabulary/languages/' + record.language + '"/>\n' +
		'        </bf:language>\n';
	instanceText += languageText;

	var provisionText =
		'        <bf:provisionActivity>\n' +
		'            <bf:ProvisionActivity>\n' +
		'                <rdf:type rdf:resource="http://id.loc.gov/ontologies/bibframe/Publication"/>\n' +
		'                <bf:daterdf:datatype="http://id.loc.gov/datatypes/edtf">' + record.publication_year + '</bf:date>\n' +
		'                <bf:place>\n' +
		'                    <bf:Place rdf:about="http://id.loc.gov/vocabulary/countries/ilu"/>\n' +
		'                </bf:place>\n' +
		'                <bf:place>\n' +
		'            		<bf:Place rdf:about="http://id.loc.gov/authorities/names/n81018573"/>\n' +
		'                </bf:place>\n' +
		'                <bf:agent>\n' +
		'                    <bf:Agent rdf:about="http://id.loc.gov/authorities/names/n79049103"/>\n' +
		'                </bf:agent>\n' +
		'            </bf:ProvisionActivity>\n' +
		'        </bf:provisionActivity>\n';
	instanceText += provisionText;

 	instanceText += titleText;

	var pagesText = '        <bf:extent>' + record.number_of_pages + '</bf:extent>\n';
	instanceText += pagesText;

	instanceText +=
		'        <bf:dimensions>28 cm.</bf:dimensions>\n' +
		'        <bf:media>\n' +
		'            <bf:Media rdf:about="http://id.loc.gov/vocabulary/mediaTypes/n"/>\n' +
		'        </bf:media>\n' +
		'        <bf:content>\n' +
		'            <bf:Content rdf:about="http://id.loc.gov/vocabulary/contentTypes/txt"/>\n' +
		'        </bf:content>\n' +
		'        <bf:carrier>\n' +
		'            <bf:Carrier rdf:about="http://id.loc.gov/vocabulary/carriers/nc"/>\n' +
		'        </bf:carrier>\n';

	var notesText =
		'        <bf:note>\n' +
		'            <bf:Note>' +
		'                <rdfs:label>Includes bibliographical references (page ' + record.bibliographies + ').</rdfs:label>\n' +
		'                <bf:noteType>bibliography</bf:noteType>\n' +
		'            </bf:Note>\n' +
		'        </bf:note>\n';
	instanceText += notesText;

	instanceText += 
		'        <bf:instanceOf rdf:resource="http://example.org/d0e1#Work"/>\n' +
		'    </bf:Instance>\n';

	var endText = '</rdf:RDF>';

	var text = startText + adminText + workText + instanceText + endText;
	downloadFile(text,'bibframe');
}