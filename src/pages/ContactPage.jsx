import ContactHero from "../components/Contact/ContactHero";
import ContactForm from "../components/Contact/ContactForm";


export default function ContactPage() {
  return (
    <>
     <div className="bg-white relative z-10">
      <ContactHero />
      <ContactForm />
      </div>
   
    </>
  );
}
