<?php class GoogleMapMarker extends DataObject {
    private static $db = array(
        'Latitude' => 'Text',
        'Longitude' => 'Text',
        'Title' => 'Text',
        'Content' => 'Text',
        'SortOrder' => 'Int',
        'Street'  => 'Text',
        'Suburb'  => 'Text',
        'State'   => 'Text',
        'Country' => 'Text'
    );

    private static $has_one = array(
        'Map' => 'GoogleMapsPage',
        'Image' => 'Image'
    );

    function onAfterWrite(){
       parent::onAfterWrite();
       $markers = GoogleMapMarker::get()->sort('SortOrder');
       if($markers){
         //create the markers.xml file for markers
         $dom = new DOMDocument("1.0");
         $node = $dom->createElement("markers"); //Create new element node
         $parnode = $dom->appendChild($node); //make the node show up
         $filename = 'markers-'.$this->MapID.'.xml';
         $folder = Folder::find_or_make('xml-files');
         $path = '../assets/xml-files/'.$filename;
         header("Content-type: text/xml");
         //add in the marker nodes
         foreach($markers as $marker){
           $img = '';
           if($marker->ImageID){
             $img = $marker->Image()->AbsoluteURL;
           }
           $node = $dom->createElement("marker");
			     $newnode = $parnode->appendChild($node);
           $newnode->setAttribute("title",$marker->Title);
           $newnode->setAttribute("lat",$marker->Latitude);
           $newnode->setAttribute("lng",$marker->Longitude);
           $newnode->setAttribute("content",$marker->Content);
           $newnode->setAttribute("img_url",$img);
         }
         $dom->saveXML();
	       $dom->save($path);
       }
    }

    function onBeforeWrite(){
      if($this->Latitude == ''){
        if($this->Street != ''){
          $st = $this->Street;
          $sub = $this->Suburb;
          $state = $this->State;

          $doc = new DOMDocument();
          $doc->load("http://maps.google.com/maps/api/geocode/xml?address=".$st.",+".$sub.",+".$state."&sensor=false");
          if($doc->getElementsByTagName('result')->length) {
            $results = $doc->getElementsByTagName("result");
            $results = $results->item(0);
            $results = $results->getElementsByTagName("geometry");
            $results = $results->item(0);
            $results = $results->getElementsByTagName("location");

            foreach($results as $result){
              $lats = $result->getElementsByTagName("lat");
              $lat = $lats->item(0)->nodeValue;

              $lngs = $result->getElementsByTagName("lng");
              $lng = $lngs->item(0)->nodeValue;
            }
            $this->Latitude = $lat;
            $this->Longitude = $lng;
          }
        }
      }
      parent::onBeforeWrite();
    }

    function getCMSFields(){
      $fields = new FieldList();
      $fields->push(new TextField('Title'));
      $fields->push(new UploadField('Image'));
      $fields->push(new TextField('Street'));
      $fields->push(new TextField('Suburb'));
      $fields->push(new TextField('State'));
      $fields->push(new TextField('Country'));
      $fields->push(new TextField('Latitude'));
      $fields->push(new TextField('Longitude'));
      $fields->push(new TextAreaField('Content'));
      return $fields;
    }
}
