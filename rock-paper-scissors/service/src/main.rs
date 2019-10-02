use oasis_std::Context;

#[derive(oasis_std::Service)]
struct RockPaperScissors;

impl RockPaperScissors {
    pub fn new(_ctx: &Context) -> Self {
        Self
    }

    pub fn say_hello(&self, ctx: &Context) -> String {
        format!("Hello, {}!", ctx.sender())
    }
}

fn main() {
    oasis_std::service!(RockPaperScissors);
}

#[cfg(test)]
mod tests {
    extern crate oasis_test;

    use super::*;

    #[test]
    fn test() {
        let sender = oasis_test::create_account(1);
        let ctx = Context::default().with_sender(sender);
        let client = RockPaperScissors::new(&ctx);
        println!("{}", client.say_hello(&ctx));
    }
}
