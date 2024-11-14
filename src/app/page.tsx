export default async function Home() {


//  const imageUrl = user?.imageUrl || '';
//  const username = user?.username || '';
//  const firstName = user?.firstName;
//  const lastName = user?.lastName;
//  const email = user?.emailAddresses[0].emailAddress;
//  const id = user?.id;
//  const welcomeSuffix = firstName ? `${firstName} ${lastName} : ${email} : ${id}` : '';

  return (
    <div className="flex flex-col justify-center items-center h-full w-full mx-auto p-6 bg-slate-900 rounded-lg">
      <h1 className="text-white text-4xl font-bold">Bienvenue sur la plateforme</h1>
    </div>
  );
}
