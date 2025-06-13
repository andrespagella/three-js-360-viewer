import React from 'react';
import DocumentTemplate from '../components/DocumentTemplate';

const PoliticaPrivacidad = () => {
  return (
    <DocumentTemplate title="Política de Privacidad">
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            1. Información General
          </h2>
          <p className="mb-4">
            Atrim Argentina S.A. ("nosotros", "nuestra", "nos") se compromete a proteger su privacidad. Esta Política de Privacidad describe cómo recopilamos, utilizamos, almacenamos y protegemos su información personal cuando utiliza nuestra aplicación 3D Showcase.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            2. Información que Recopilamos
          </h2>
          <p className="mb-4">
            Recopilamos la siguiente información cuando utiliza nuestra aplicación:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>Información de contacto:</strong> Nombre, correo electrónico, teléfono y empresa cuando completa formularios</li>
            <li><strong>Información de uso:</strong> Cómo interactúa con la aplicación, productos seleccionados y preferencias</li>
            <li><strong>Información técnica:</strong> Tipo de dispositivo, navegador, dirección IP y datos de rendimiento</li>
            <li><strong>Información de localización:</strong> País y región basados en su configuración de idioma</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            3. Cómo Utilizamos su Información
          </h2>
          <p className="mb-4">
            Utilizamos la información recopilada para:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Proporcionar y mejorar nuestros servicios</li>
            <li>Responder a sus consultas y solicitudes</li>
            <li>Enviar información sobre productos y servicios relevantes</li>
            <li>Personalizar su experiencia en la aplicación</li>
            <li>Analizar el uso de la aplicación para mejoras</li>
            <li>Cumplir con obligaciones legales</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            4. Compartir Información
          </h2>
          <p className="mb-4">
            No vendemos, alquilamos ni compartimos su información personal con terceros, excepto en las siguientes circunstancias:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Con su consentimiento explícito</li>
            <li>Con proveedores de servicios que nos ayudan a operar la aplicación</li>
            <li>Para cumplir con obligaciones legales</li>
            <li>Para proteger nuestros derechos y seguridad</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            5. Seguridad de la Información
          </h2>
          <p className="mb-4">
            Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger su información personal contra acceso no autorizado, alteración, divulgación o destrucción. Sin embargo, ningún método de transmisión por internet o almacenamiento electrónico es 100% seguro.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            6. Cookies y Tecnologías Similares
          </h2>
          <p className="mb-4">
            Utilizamos cookies y tecnologías similares para mejorar su experiencia, analizar el uso de la aplicación y personalizar el contenido. Puede configurar su navegador para rechazar cookies, aunque esto puede afectar la funcionalidad de la aplicación.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            7. Sus Derechos
          </h2>
          <p className="mb-4">
            Usted tiene los siguientes derechos respecto a su información personal:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Acceder a la información que tenemos sobre usted</li>
            <li>Corregir información inexacta o incompleta</li>
            <li>Solicitar la eliminación de su información personal</li>
            <li>Oponerse al procesamiento de su información</li>
            <li>Retirar su consentimiento en cualquier momento</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            8. Retención de Datos
          </h2>
          <p className="mb-4">
            Conservamos su información personal solo durante el tiempo necesario para cumplir con los propósitos descritos en esta política, a menos que la ley requiera un período de retención más largo.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            9. Transferencias Internacionales
          </h2>
          <p className="mb-4">
            Su información puede ser transferida y procesada en países diferentes al suyo. Nos aseguramos de que estas transferencias cumplan con las leyes de protección de datos aplicables.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            10. Cambios en esta Política
          </h2>
          <p className="mb-4">
            Podemos actualizar esta Política de Privacidad ocasionalmente. Le notificaremos cualquier cambio significativo publicando la nueva política en la aplicación y actualizando la fecha de "Última actualización".
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            11. Contacto
          </h2>
          <p className="mb-4">
            Si tiene preguntas sobre esta Política de Privacidad o sobre cómo manejamos su información personal, puede contactarnos a través de los medios proporcionados en nuestra aplicación o sitio web oficial.
          </p>
        </section>
      </div>
    </DocumentTemplate>
  );
};

export default PoliticaPrivacidad; 