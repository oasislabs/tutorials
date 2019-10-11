use oasis_std::{Address, Context};

#[derive(oasis_std::Service)]
struct DiceGame {
    description: String,
    accepting_votes: bool,
    admin: Address,
}

impl DiceGame {
    pub fn new(ctx: &Context, description: String) -> Self {
        Self {
            description,
            accepting_votes: true,
            admin: ctx.sender(),
        }
    }

    pub fn say_hello(&self, ctx: &Context) -> String {
        format!("Hello, {}!", ctx.sender())
    }
}

fn main() {
    oasis_std::service!(DiceGame);
}

#[cfg(test)]
mod tests {
    extern crate oasis_test;

    use super::*;

    #[test]
    fn test() {
        let sender = oasis_test::create_account(1);
        let ctx = Context::default().with_sender(sender);
        // let client = DiceGame::new(&ctx);
        let description = "What's for dinner?";
        let mut client =
            DiceGame::new(&ctx, description.to_string());
        println!("{}", client.say_hello(&ctx));
    }
}
