import React from 'react';
import DocumentTemplate from '../components/DocumentTemplate';

const TerminosCondiciones = () => {
  return (
    <DocumentTemplate title="Términos y Condiciones">
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            1. Aceptación de los Términos
          </h2>
          <p className="mb-4">
            Al acceder y utilizar la aplicación 3D Showcase de Atrim Argentina S.A., usted acepta estar sujeto a estos términos y condiciones de uso. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestra aplicación.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            2. Descripción del Servicio
          </h2>
          <p className="mb-4">
            3D Showcase es una aplicación que permite a los usuarios explorar y visualizar productos de baño en un entorno 3D interactivo. La aplicación incluye funcionalidades para seleccionar productos, configurar ambientes y solicitar información adicional.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            3. Uso Aceptable
          </h2>
          <p className="mb-4">
            Usted se compromete a utilizar la aplicación únicamente para fines legítimos y de acuerdo con estos términos. Está prohibido:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Utilizar la aplicación para cualquier propósito ilegal o no autorizado</li>
            <li>Intentar acceder a áreas restringidas de la aplicación</li>
            <li>Interferir con el funcionamiento normal de la aplicación</li>
            <li>Transmitir virus, malware o cualquier código dañino</li>
            <li>Recopilar información de otros usuarios sin su consentimiento</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            4. Propiedad Intelectual
          </h2>
          <p className="mb-4">
            Todo el contenido de la aplicación, incluyendo pero no limitado a textos, gráficos, logotipos, iconos, imágenes, clips de audio, descargas digitales y compilaciones de datos, es propiedad de Atrim Argentina S.A. y está protegido por las leyes de propiedad intelectual.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            5. Privacidad
          </h2>
          <p className="mb-4">
            Su privacidad es importante para nosotros. El uso de la información personal que recopilamos está sujeto a nuestra Política de Privacidad, que forma parte de estos términos y condiciones.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            6. Limitación de Responsabilidad
          </h2>
          <p className="mb-4">
            Atrim Argentina S.A. no será responsable por daños indirectos, incidentales, especiales, consecuentes o punitivos, incluyendo pero no limitado a pérdida de beneficios, datos o uso, derivados del uso o la imposibilidad de usar la aplicación.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            7. Modificaciones
          </h2>
          <p className="mb-4">
            Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en la aplicación. Su uso continuado de la aplicación después de cualquier cambio constituye su aceptación de los nuevos términos.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            8. Ley Aplicable
          </h2>
          <p className="mb-4">
            Estos términos se rigen por las leyes de la República Argentina. Cualquier disputa relacionada con estos términos o el uso de la aplicación estará sujeta a la jurisdicción exclusiva de los tribunales de la Ciudad Autónoma de Buenos Aires.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            9. Contacto
          </h2>
          <p className="mb-4">
            Si tiene alguna pregunta sobre estos términos y condiciones, puede contactarnos a través de los medios proporcionados en nuestra aplicación o sitio web oficial.
          </p>
        </section>
      </div>
    </DocumentTemplate>
  );
};

export default TerminosCondiciones; 