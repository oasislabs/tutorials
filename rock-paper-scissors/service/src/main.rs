use oasis_std::{Address, Context};

#[derive(oasis_std::Service)]
struct RockPaperScissors {
    player_name: String,
    player_move: u32, // TODO would be better as an enum?
    // 1 = rock, 2 = paper, 3 = scissors
    challenger_name: String,
    challenger_move: u32,
    // 1 = rock, 2 = paper, 3 = scissors
    open: bool, // whether or not someone can challenge. true = player has played. false = nobody has played or just finished.
}


type Result<T> = std::result::Result<T, String>;

impl RockPaperScissors {

    pub fn new(_ctx: &Context) -> Self {
        Self {
            player_name: "".to_string(),
            player_move: 0,
            challenger_name: "".to_string(),
            challenger_move: 0,
            open: true,
        }

    }

    pub fn can_play(&self, _ctx: &Context) -> bool {
        return self.open;
    }

    pub fn reveal(&self, _ctx: &Context) -> Result<String> {
        let map = vec!["None".to_string(), "Rock".to_string(), "Paper".to_string(), "Scissors".to_string()];
        if self.open {
            return Err("The game hasn't finished yet. You can query scores by calling scores().".to_string())
        }
        if self.player_move == self.challenger_move {
            let x: String = format!("{} played {} and {} played {}. Tie!", self.player_name, map[self.player_move as usize], self.challenger_name, map[self.challenger_move as usize]);
            return Ok(x);
        }
        if self.player_move > self.challenger_move {
            let x: String = format!("{} played {} and {} played {}. Player Wins!", self.player_name, map[self.player_move as usize], self.challenger_name, map[self.challenger_move as usize]);
            return Ok(x);
        }
        if self.player_move == 1 && self.challenger_move == 3 {
            let x: String = format!("{} played {} and {} played {}. Player Wins!", self.player_name, map[self.player_move as usize], self.challenger_name, map[self.challenger_move as usize]);
            return Ok(x);
        }
        let x: String = format!("{} played {} and {} played {}. Challenger Wins!", self.player_name, map[self.player_move as usize], self.challenger_name, map[self.challenger_move as usize]);
        return Ok(x);
    }

    pub fn play(&mut self, _ctx: &Context, p_name: String, p_move: u32) -> Result<String> {
        if !self.open {
            return Err("The game has ended.".to_string());
        }
        if self.player_move > 0 {
            return Err("Someone already played.".to_string());
        }
        if p_move < 1 || p_move > 3 {
            return Err("Invalid move.".to_string());
        }
        self.player_move = p_move;
        self.player_name = p_name;
        if self.player_move > 0 && self.challenger_move > 0 {
            self.open = false;
            return Ok("Both players have played. Use reveal() to see what both players' moves were.".to_string());
        }
        Ok(format!("Player {} has played.", self.player_name))
    }

    pub fn challenge(&mut self, _ctx: &Context, c_name: String, c_move: u32) -> Result<String> {
        if !self.open {
            return Err("The game has ended.".to_string());
        }
        if self.challenger_move > 0 {
            return Err("Someone already challenged.".to_string());
        }
        if c_move < 1 || c_move > 3 {
            return Err("Invalid move.".to_string());
        }
        self.challenger_move = c_move;
        self.challenger_name = c_name;
        if self.player_move > 0 && self.challenger_move > 0 {
            self.open = false;
            return Ok("Both players have played. Use reveal() to see what both players' moves were.".to_string());
        }
        Ok(format!("Player {} has played.", self.challenger_name))
    }
}


fn main() {
    oasis_std::service!(RockPaperScissors);
}

#[cfg(test)]
mod tests {
    extern crate oasis_test;

    use super::*;


    fn create_account() -> (Address, Context) {
        let sender = oasis_test::create_account(1);
        let ctx = Context::default().with_sender(sender);
        (sender, ctx)
    }

    #[test]
    fn functionality() {
        let (_player, player_ctx) = create_account();
        let (_challenger, challenger_ctx) = create_account();
        let mut game = RockPaperScissors::new(&player_ctx);

        assert_eq!(game.can_play(&player_ctx), true); // they can play in any order tbh
        // player 1 plays rock
        println!("{}", game.play(&player_ctx, "stan".to_string(), 1).unwrap());
        // anyone can now challenge
        assert_eq!(game.can_play(&player_ctx), true);
        // challenger challenges, plays rock
        println!("{}", game.challenge(&challenger_ctx, "nick".to_string(), 1).unwrap());
        // nobody can challenge anymore
        assert_eq!(game.can_play(&player_ctx), false);
        println!("{}", game.reveal(&player_ctx).unwrap());
    }

    #[test]
    fn repeats() {
        let (_player, player_ctx) = create_account();
        let (_challenger, challenger_ctx) = create_account();
        let mut game = RockPaperScissors::new(&player_ctx);

        assert_eq!(game.can_play(&player_ctx), true); // they can play in any order
        assert!(game.reveal(&player_ctx).is_err());

        // stan plays first, plays rock
        println!("{}", game.play(&player_ctx, "stan".to_string(), 1).unwrap());
        // you can't play again
        assert!(game.play(&player_ctx, "mal".to_string(), 2).is_err());

        // challenger challenges, plays rock
        println!("{}", game.challenge(&challenger_ctx, "nick".to_string(), 1).unwrap());
        // you can't challenge again
        assert!(game.challenge(&challenger_ctx, "mal".to_string(), 2).is_err());
        // nobody can challenge anymore
        assert_eq!(game.can_play(&player_ctx), false);
    }

    #[test]
    fn bad_moves() {
        let (_player, player_ctx) = create_account();
        let (_challenger, challenger_ctx) = create_account();
        let mut game = RockPaperScissors::new(&player_ctx);

        // you can't play an invalid move
        assert!(game.play(&player_ctx, "mal".to_string(), 0).is_err());
        // you can't play an invalid move
        assert!(game.play(&player_ctx, "mal".to_string(), 5).is_err());
        // you can't challenge an invalid move
        assert!(game.challenge(&challenger_ctx, "mal".to_string(), 0).is_err());
        // you can't challenge an invalid move
        assert!(game.challenge(&challenger_ctx, "mal".to_string(), 6).is_err());
    }
}
