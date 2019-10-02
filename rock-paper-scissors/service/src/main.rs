use oasis_std::{Address, Context};

#[derive(oasis_std::Service)]
struct RockPaperScissors {
    player: Address,
    player_move: u32, // the first player's move is stored. the challenger's isn't.
    // 1 = rock, 2 = paper, 3 = scissors
    challenger_move: u32,
    // 1 = rock, 2 = paper, 3 = scissors
    open: bool, // whether or not someone can challenge. true = player has played. false = nobody has played or just finished.
    won: u32,
    lost: u32,
    tied: u32,
}


type Result<T> = std::result::Result<T, String>;


impl RockPaperScissors {

    pub fn new(ctx: &Context) -> Self {
        Self {
            player: ctx.sender(),
            player_move: 0,
            challenger_move: 0,
            open: false,
            won: 0,
            lost: 0,
            tied: 0
        }

    }

    pub fn can_challenge(&self, _ctx: &Context) -> bool {
        return self.open;
    }

    pub fn reveal(&self, _ctx: &Context) -> Result<String> {
        let map = vec!["None".to_string(), "Rock".to_string(), "Paper".to_string(), "Scissors".to_string()];
        if self.open {
            return Err("The current game hasn't finished yet. You can query scores by calling scores().".to_string())
        }
        if self.player_move <= 0 {
            return Err("No games have been played yet!".to_string());
        }
        if self.player_move == self.challenger_move {
            let x: String = format!("Player played {} and Challenger played {}. Tie!", map[self.player_move as usize], map[self.challenger_move as usize]);
            return Ok(x);
        }
        if self.player_move > self.challenger_move {
            let x: String = format!("Player played {} and Challenger played {}. Player Wins!", map[self.player_move as usize], map[self.challenger_move as usize]);
            return Ok(x);
        }
        if self.player_move == 1 && self.challenger_move == 3 {
            let x: String = format!("Player played {} and Challenger played {}. Player Wins!", map[self.player_move as usize], map[self.challenger_move as usize]);
            return Ok(x);
        }
        let x: String = format!("Player played {} and Challenger played {}. Challenger Wins!", map[self.player_move as usize], map[self.challenger_move as usize]);
        return Ok(x);
    }

    pub fn scores(&self, _ctx: &Context) -> String {
        return format!("Won: {}, Lost: {}, and Tied: {}", self.won, self.lost, self.tied);
    }

    pub fn play(&mut self, ctx: &Context, p_move: u32) -> Result<String> {
        if self.player != ctx.sender() {
            return Err("You aren't the main player. Start a new game!".to_string());
        }
        if p_move < 1 || p_move > 3 {
            return Err("Invalid move.".to_string());
        }
        self.player_move = p_move;
        self.open = true; // player always has to go first, otherwise we'll get confused
        Ok("Player has played. The move is secret until the Challenger plays.".to_string())
    }

    pub fn challenge(&mut self, ctx: &Context, c_move: u32) -> Result<String> {
        if self.player == ctx.sender() {
            return Err("You can't play against yourself.".to_string());
        }
        if !self.open {
            return Err("Player hasn't started a new game yet.".to_string());
        }
        if c_move < 1 || c_move > 3 {
            return Err("Invalid move.".to_string());
        }
        self.challenger_move = c_move;

        if self.player_move == self.challenger_move {
            self.tied += 1;
        }
        else if self.player_move > self.challenger_move {
            self.won += 1;
        }
        else if self.player_move == 1 && self.challenger_move == 3 {
            self.won += 1;
        }
        else {
            self.lost += 1;
        }
        self.open = false;
        Ok("Challenger has played. Use reveal() to see what both players' moves were.".to_string())
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

        assert_eq!(game.can_challenge(&player_ctx), false);
        // assert_eq!(game.scores(&player_ctx), "Won: 0, Lost: 0, and Tied: 0".to_string());

        // player 1 plays rock
        game.play(&player_ctx, 1).unwrap();

        // anyone can now challenge
        assert_eq!(game.can_challenge(&player_ctx), true);

        // challenger challenges, plays rock
        game.challenge(&challenger_ctx, 1).unwrap();

        // nobody can challenge anymore
        assert_eq!(game.can_challenge(&player_ctx), false);

        println!("{}", game.reveal(&player_ctx).unwrap());
        println!("{}", game.scores(&player_ctx));
    }
}
