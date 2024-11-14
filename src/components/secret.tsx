"use client";

import { useState, useEffect } from "react";
import { createSecret, getSecret } from "@/actions/actions";

export default function Secret() {
  const [secret, setSecret] = useState(""); // Stocke le secret actuel
  const [content, setContent] = useState(""); // Stocke le contenu du textarea
  const [error, setError] = useState(""); // Stocke les messages d'erreur

  // UseEffect pour récupérer le secret actuel
  useEffect(() => {
    const loadSecret = async () => {
      const result = await getSecret();
      if (result.success) {
        setSecret(result.content || "");
      } else {
        setError(result.error || "Une erreur inconnue s'est produite");
      }
    };
    loadSecret();
  }, []);

  // Gestionnaire de soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content) {
      setError("Le champ ne peut pas être vide");
      return;
    }

    // Sauvegarde le nouveau secret
    const result = await createSecret(content);
    if (result.success) {
      setContent(""); // vide le textarea
      // Recharge le secret mis à jour
      const newSecret = await getSecret();
      if (newSecret.success) {
        setSecret(newSecret.content || "");
      } else {
        setError("Erreur de sauvegarde du secret");
      }
    }
  }

  // Rendu du composant
  return (
    <section className="flex flex-col items-center justify-center h-full w-full max-w-xl mx-auto">
      

      <div className="w-full mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-4 w-full border border-gray-700 rounded-md p-4">
          <div className="">
            <div className="mb-5">Secret : {secret}</div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 rounded-md border border-gray-300 text-gray-800"
              placeholder="Entrez votre secret"
            />

            {/* Affichage des erreurs */}
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          {/* Bouton de soumission */}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md"
          >
            Enregistrer
          </button>
        </form>
      </div>
    </section>
  );
}
