<?php class MapPage extends Page {
    private static $db = array(
        'ColourScheme' => 'Enum("Dark, Light, Normal, Colourful", "Normal")',
        'StartingLat' => 'Text',
        'StartingLong' => 'Text',
        'StartingZoom' => 'Int',
        'XMLFile' => 'Text'
    );
  
    private static $has_one = array(
       'MarkerIcon' => 'Image'
    );
  
    private static $has_many = array(
       'MapMarkers' => 'MapMarker'
    );
    
    function onBeforeWrite(){	        
       $xmlfile = 'markers-'.$this->ID.'.xml';
       $this->XMLFile = $xmlfile;
       parent::onBeforeWrite();
    }
    
    public function getCMSFields(){
      $fields = parent::getCMSFields();
      $conf=GridFieldConfig_RelationEditor::create(10);
      $conf->addComponent(new GridFieldSortableRows('SortOrder'));
      $gridField = new GridField("MapMarkers", "Map Marker", $this->MapMarkers(), $conf);
      $fields->addFieldToTab("Root.Map", new DropdownField('ColourScheme', 'Colour scheme of map', $this->dbObject("ColourScheme")->enumValues()));
      $fields->addFieldToTab("Root.Map", new TextField('StartingLat', 'Starting latitude of map'));
      $fields->addFieldToTab("Root.Map", new TextField('StartingLong', 'Starting Longitude of map'));
      $fields->addFieldToTab("Root.Map", new TextField('StartingZoom', 'Starting zoom of map'));
      $fields->addFieldToTab("Root.Map", new UploadField('MarkerIcon', 'Icon for markers'));
      $fields->addFieldToTab("Root.Map", $gridField);	
      //$fields->addFieldToTab("Root.Map", new LiteralField('', 'XML File '.$this->XMLFile.''));
      return $fields;
    }
}

class MapPage_Controller extends Page_Controller {
  
   public function init() {
      parent::init();
      $api = Config::inst()->get('MapPage', 'api_key');
      $show_search = Config::inst()->get('MapPage', 'show_search');
      Requirements::css('google-maps/css/map.css');
      Requirements::javascript('framework/thirdparty/jquery/jquery.js');
      Requirements::javascript('google-maps/javascript/map.js');
	}
  
  public function ApiKey(){
    $api = Config::inst()->get('MapPage', 'api_key');
    return $api;
  }
  
  /*
  * Settings Form is merely a form to contain hidden variables used in the javascript to power the map
  */
  public function SettingsForm(){
    $zoom = 8;
    $lat = -31.950384;
    $long = 115.854078;
    $marker = Director::baseURL().'google-maps/images/marker.png';
    $scheme = 'normal';
    $file = '';
    
    if($this->StartingZoom){
      $zoom = $this->StartingZoom;
    }
    if($this->StartingLat){
      $lat = $this->StartingLat;
    }
    if($this->StartingLong){
      $long = $this->StartingLong;
    }
    if($this->MarkerIconID){
      $marker = $this->MarkerIcon()->AbsoluteURL;
    }
    if($this->ColourScheme){
      $scheme = $this->ColourScheme;
    }
    if($this->XMLFile){
      $file = $this->XMLFile;
    }
    
    $fields = new FieldList(
      HiddenField::create("StartZoom", "StartZoom", $zoom)->setAttribute("id", "start_zoom"),
      HiddenField::create("StartLat", "StartLat", $lat)->setAttribute("id", "start_lat"),
      HiddenField::create("StartLong", "StartLong", $long)->setAttribute("id", "start_long"),
      HiddenField::create("Marker", "Marker", $marker)->setAttribute("id", "marker_icon"),
      HiddenField::create("Scheme", "Scheme", $scheme)->setAttribute("id", "map_scheme"),
      HiddenField::create("MarkerFile", "MarkerFile", $file)->setAttribute("id", "marker_file")
    );
    
    $actions = new FieldList();
		
		$form = new Form($this, 'SettingsForm', $fields, $actions);
		
		return $form;
  }
}