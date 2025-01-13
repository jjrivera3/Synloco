import { CardDemo } from "./ui/CardDemo";

const Features = () => {
  return (
    <section className="mt-20">
      <div className="max-w-6xl mx-auto w-full gap-6">
        <h3
          id="#features1"
          className="text-3xl font-bold mb-2 text-center gradient-title"
        >
          About Synloco
        </h3>
        <div>
          <p className="text-lg text-center mb-10">
            SynLoco is a powerful project management tool designed to help teams
            organize, track, and manage their work efficiently. It combines
            intuitive design with robust features to streamline your workflow
            and boost productivity.
          </p>
        </div>
      </div>
      <CardDemo />
    </section>
  );
};

export default Features;
