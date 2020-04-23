use oasis_std::{
    abi::*,
    collections::map::{Entry, Map},
    Context,
};

#[derive(oasis_std::Service)]
struct HelloWorld {
    hello_worlds: Map<String, String>,
}

impl HelloWorld {
    /// Constructs a new `HelloWorld` service.
    pub fn new(_ctx: &Context) -> Self {
        let hello_worlds = vec![
            ("en", "Hello, world!"),
            ("sl", "Pozdravljen, svet!"),
            ("de", "Hello Welt!"),
            ("fr", "Bonjour le monde!"),
        ]
        .into_iter()
        .map(|(lang, hello)| (lang.to_string(), hello.to_string()))
        .collect();

        Self { hello_worlds }
    }

    /// Get hello world taking as input the desired language.
    pub fn say_hello(&self, _ctx: &Context, language: String) -> Option<&String> {
        self.hello_worlds.get(&language)
    }
    /// Add a new language Hello World! pair.
    pub fn add_hello(
        &mut self,
        _ctx: &Context,
        language: String,
        hello_world: String,
    ) -> Result<(), Error> {
        eprintln!("Adding \"{}\" for \"{}\"", hello_world, language);
        match self.hello_worlds.entry(language) {
            Entry::Vacant(vacant) => vacant.insert(hello_world),
            Entry::Occupied(_) => return Err(Error::DuplicateEntry),
        };
        Ok(())
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub enum Error {
    UnsupportedLanguage,
    DuplicateEntry,
}

fn main() {
    oasis_std::service!(HelloWorld);
}

#[cfg(test)]
mod tests {
    use super::*;
    use oasis_std::{Address, Context};

    /// Creates a new account and a `Context` with the new account as the sender.
    fn create_account_ctx() -> (Address, Context) {
        let addr = oasis_test::create_account(0 /* initial balance */);
        let ctx = Context::default().with_sender(addr).with_gas(100_000);
        (addr, ctx)
    }

    #[test]
    fn test_paths() {
        let (_me, ctx) = create_account_ctx();

        let mut hello_world = HelloWorld::new(&ctx);

        // One happy path.
        eprintln!(
            "In Slovenian: {:?}",
            hello_world.say_hello(&ctx, "sl".to_string()).unwrap()
        );

        // Double unhappiness.
        eprintln!(
            "In Samoan: {:?}",
            hello_world.say_hello(&ctx, "ws".to_string())
        );
        eprintln!(
            "{:?}",
            hello_world.add_hello(&ctx, "en".to_string(), "Zeno World!".to_string())
        );

        // Let's fix it!
        match hello_world.add_hello(
            &ctx,
            "ws".to_string(),
            "alofa fiafia i le lalolagi!".to_string(),
        ) {
            Err(_) => eprintln!("Attempt to insert a duplicate entry."),
            Ok(_) => (),
        };

        // And test it.
        let in_samoan = hello_world.say_hello(&ctx, "ws".to_string()).unwrap();
        eprintln!("In Samoan: {:?}", in_samoan);
        assert_eq!(in_samoan, "alofa fiafia i le lalolagi!");
    }
}
