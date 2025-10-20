import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="bg-black p-16 flex flex-col gap-2 items-start justify-center text-white">
        <p>© 2025 Pokémon DB. Built by Jaehyun Lee.</p>
        <p>
          Data provided by PokéAPI (
          <Link href="https://pokeapi.co" className="hover:underline">
            pokeapi.co
          </Link>
          ){" "}
        </p>
        <p>
          Pokémon and Pokémon character names are trademarks of Nintendo, Game
          Freak, and Creatures Inc.
        </p>
        <p>Contact: jhyon123@gmail.com</p>
        <p>
          Source:{" "}
          <Link
            href="https://github.com/JaeHyunLee123/pokemon-db"
            className="hover:underline"
          >
            github.com/JaeHyunLee123/pokemon-db
          </Link>
        </p>
      </div>
      <div className="bg-red-500 h-10" />
    </footer>
  );
}
