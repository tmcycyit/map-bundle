Google map widget for sonata admin.

UPGRADE FROM 1.0
=======================

Create example project Bus (src/Bus)
------------------------------------


 * In Sonata Admin Class:
   ```
   // namespace Bus\MainBundle\Admin;

   // Fields to be shown on create/edit forms
   protected function configureFormFields(FormMapper $formMapper)
   {
        $formMapper
            ->add('name')
            ->add('position', 'mapmarker', array('attr' =>
                    array('draggable' => true,
                         'limit' => 1,
                         'center-lat' => 40.177037117759895,
                         'center-lng' => 44.51488494873047,
                         'zoom' => 12) ))
            ->add('position', 'mapmarker')
            ->add('creationDate')
            ;

   }

   ```

   or:

   ```
   // namespace Bus\MainBundle\Admin;

   // Fields to be shown on create/edit forms
   protected function configureFormFields(FormMapper $formMapper)
   {
        $formMapper
            ->add('name')
            ->add('position', 'mapmarker', array('attr' =>
                    array('draggable' => true,
                         'limit' => 1,
                         'center-lat' => 40.177037117759895,
                         'center-lng' => 44.51488494873047,
                         'zoom' => 12) ))
            ->add('position', 'mapmarker')
            ->add('creationDate')
            ;

   }

   ```
 * Add method in the same file, with which you can include map twig
   ```
   public function getFormTheme() {
        return array('BusMapBundle:Admin:mapmarker_edit.html.twig');
   }
   ```

 * Create new methods in Entity file, that will create and return an array with parameters
   longitude and latitude
   ```
   /**
     * Get getPosition
     * @return array
     *
     */
    public function getPosition()
    {
        return array('position' => array('lat' => $this->latitude,'lng' => $this->longitude));
    }
    /**
     * Set setPosition
     * @param array $latlng
     * @return Stop
     *
     */
    public function setPosition($latlng)
    {
        $this
            ->setLatitude($latlng['lat'])
            ->setLongitude($latlng['lng']);
        return $this;
    }
   ```

   consider that there are already properties:

   ```
   /**
     * @var float
     *
     * @ORM\Column(name="longitude", type="decimal", nullable=false, scale=7)
     */
    private $longitude;

    /**
     * @var float
     *
     * @ORM\Column(name="latitude", type="decimal", nullable=false, scale=7)
     */
    private $latitude;
   ```

 * Create services in admin.xml

   ```
   // EntityName - is your entity Class
   <service id="sonata.admin.main.EntityName.route" class="Bus\MainBundle\Admin\EntityNameAdmin">
      <tag name="sonata.admin" manager_type="orm" group="Entity" label="EntityNameAdmin"/>
      <argument/>
        <argument>Bus\MainBundle\Entity\EntityName</argument>
        <argument/>
        <call method="setTemplate">
        <argument>edit</argument>
            <argument>BusMapBundle:Admin:edit.html.twig</argument>
        </call>
   </service>
   ```
